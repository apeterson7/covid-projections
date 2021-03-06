import { nonNull } from 'common/utils';
import {
  ActualsTimeseriesRow,
  PredictionTimeseriesRow,
  Actuals,
} from 'api/schema/RegionSummaryWithTimeseries';
import {
  indexOfLastValue,
  hasRecentData,
  omitDataAfterDate,
  lastValue,
} from './utils';

// We sometimes need to override the ICU metric for locations due to bad data, etc.
const ICU_HEADROOM_OVERRIDES: Array<string> = [];

/**
 * Default utilization to use (before decomp) if there isn't a location-specific
 * value in the API.
 */
const ICU_DEFAULT_UTILIZATION = 0.75;

/**
 * We subtract this "decomp" factor from the typical ICU Utilization rates we
 * get from the API to account for hospitals being able to decrease their utilization
 * (by cancelling elective surgeries, using surge capacity, etc.).
 */
const ICU_DECOMP_FACTOR = 0.21;
const ICU_DECOMP_FACTOR_STATE_OVERRIDES: { [key: string]: number } = {
  Alabama: 0.15,
  Arizona: 0.4,
  Delaware: 0.3,
  'District of Columbia': 0.15,
  Georgia: 0.1,
  // TODO(https://trello.com/c/1ddB5ntl/): CCM is currently giving us an
  // extra-high utilization rate. If that gets fixed we may need to bump this
  // back down.
  Mississippi: 0.37,
  Nevada: 0.25,
  'Rhode Island': 0,
};

/**
 * Encapsulates all of the data related to ICU Headroom (used to generate our
 * copy above the chart).
 */
export interface ICUHeadroomInfo {
  metricSeries: Array<number | null>;
  metricValue: number;

  totalBeds: number;

  covidPatients: number;
  covidPatientsIsActual: boolean;

  nonCovidPatients: number;
  nonCovidPatientsMethod: NonCovidPatientsMethod;

  overrideInPlace: boolean; // ICU Headroom has been overridden due to news reports, etc.
}

/**
 * Indicates the method by which we calculated non-covid ICU patients (so we can
 * customize the copy)
 */
export enum NonCovidPatientsMethod {
  ACTUAL,
  ESTIMATED_FROM_TYPICAL_UTILIZATION,
  ESTIMATED_FROM_TOTAL_ICU_ACTUAL,
}

/** Calculates all of the information pertaining to the ICU Headroom metric. */
export function calcICUHeadroom(
  stateName: string,
  fips: string,
  dates: Array<Date>,
  actualTimeseries: Array<ActualsTimeseriesRow | null>,
  timeseries: Array<PredictionTimeseriesRow | null>,
  actuals: Actuals,
  lastUpdated: Date,
): ICUHeadroomInfo | null {
  // TODO(https://trello.com/c/B6Z1kW8o/): Fix Tennessee Hospitalization data.
  if (fips.length > 2 && fips.slice(0, 2) === '47') {
    return null;
  }

  const overrideInPlace = ICU_HEADROOM_OVERRIDES.indexOf(fips) > -1;
  if (overrideInPlace) {
    return {
      metricSeries: actualTimeseries.map(row => 0.9),
      metricValue: 0.9,
      overrideInPlace,
      // rest of this is garbage.
      totalBeds: 0,
      covidPatients: 0,
      covidPatientsIsActual: false,
      nonCovidPatients: 0,
      nonCovidPatientsMethod: NonCovidPatientsMethod.ACTUAL,
    };
  }

  const covidPatientsResult = calcCovidICUPatientsSeries(
    dates,
    actualTimeseries,
    timeseries,
    lastUpdated,
  );

  // Use capacity from the timeseries if it's within the last 7 days, else use the
  // non-timeseries value.
  const finalTotalBeds =
    lastValue(actualTimeseries.map(r => r?.ICUBeds.capacity).slice(-7)) ||
    actuals.ICUBeds.totalCapacity;

  const nonCovidPatientsResult = calcNonCovidICUPatientsSeries(
    stateName,
    dates,
    actualTimeseries,
    timeseries,
    actuals,
    finalTotalBeds,
  );

  const metricSeries = covidPatientsResult.series.map((covidPatients, i) => {
    const nonCovidPatients = nonCovidPatientsResult.series[i];
    const totalBeds = actualTimeseries[i]?.ICUBeds.capacity || finalTotalBeds;
    if (
      covidPatients === null ||
      nonCovidPatients === null ||
      totalBeds === 0 ||
      totalBeds === null
    ) {
      return null;
    } else {
      return covidPatients / (totalBeds - nonCovidPatients);
    }
  });

  const i = indexOfLastValue(metricSeries);
  if (i === null) {
    return null;
  } else {
    return {
      metricSeries,
      metricValue: nonNull(metricSeries[i]),
      overrideInPlace,
      totalBeds: finalTotalBeds,
      covidPatients: nonNull(covidPatientsResult.series[i]),
      covidPatientsIsActual: covidPatientsResult.isActual,
      nonCovidPatients: nonNull(nonCovidPatientsResult.series[i]),
      nonCovidPatientsMethod: nonCovidPatientsResult.method,
    };
  }
}

/**
 * Calculates the number of covid ICU patients, as a series. This is the
 * numerator of the ICU Headroom metric.
 */
function calcCovidICUPatientsSeries(
  dates: Array<Date>,
  actualTimeseries: Array<ActualsTimeseriesRow | null>,
  timeseries: Array<PredictionTimeseriesRow | null>,
  lastUpdated: Date,
): { isActual: boolean; series: Array<number | null> } {
  const actualCovidPatients = actualTimeseries.map(
    row => row?.ICUBeds.currentUsageCovid || null,
  );
  if (hasRecentData(actualCovidPatients, dates)) {
    // Return actuals.
    return { isActual: true, series: actualCovidPatients };
  } else {
    // Return projections.
    return {
      isActual: false,
      series: omitDataAfterDate(
        timeseries.map(row => row?.ICUBedsInUse || null),
        dates,
        lastUpdated,
      ),
    };
  }
}

/**
 * Calculates the number of non-covid ICU patients, as a series. Uses actuals
 * if available. This is used in the denominator of the ICU Headroom metric,
 * i.e. (totalBeds - nonCovidICUPatients)
 */
function calcNonCovidICUPatientsSeries(
  stateName: string,
  dates: Array<Date>,
  actualTimeseries: Array<ActualsTimeseriesRow | null>,
  timeseries: Array<PredictionTimeseriesRow | null>,
  actuals: Actuals,
  totalBeds: number,
): { series: Array<number | null>; method: NonCovidPatientsMethod } {
  const actualTotalPatients = actualTimeseries.map(
    row => row?.ICUBeds.currentUsageTotal || null,
  );
  const actualCovidPatients = actualTimeseries.map(
    row => row?.ICUBeds.currentUsageCovid || null,
  );
  if (hasRecentData(actualTotalPatients, dates)) {
    if (hasRecentData(actualCovidPatients, dates)) {
      // We have actual total and covid patients, so we calculate non-covid
      // patients directly.
      const series = actualTotalPatients.map((total, i) => {
        const covid = actualCovidPatients[i];
        if (total === null || covid === null) {
          return null;
        } else {
          return total - covid;
        }
      });
      return { series, method: NonCovidPatientsMethod.ACTUAL };
    } else {
      // We have actual total patients but not actual covid patients, but we
      // can use projected covid patients to estimate.
      const series = actualTotalPatients.map((total, i) => {
        const covid = timeseries[i]?.ICUBedsInUse || null;
        if (total === null || covid === null) {
          return null;
        } else {
          return total - covid;
        }
      });
      return {
        series,
        method: NonCovidPatientsMethod.ESTIMATED_FROM_TOTAL_ICU_ACTUAL,
      };
    }
  } else {
    // We have no actual patient data so use typical estimates + decomp factor.
    const typicalICUUtilization =
      actuals.ICUBeds.typicalUsageRate || ICU_DEFAULT_UTILIZATION;
    const decompOverride = ICU_DECOMP_FACTOR_STATE_OVERRIDES[stateName];
    const decompFactor =
      decompOverride !== undefined ? decompOverride : ICU_DECOMP_FACTOR;
    const nonCovidUtilization = Math.max(
      0,
      typicalICUUtilization - decompFactor,
    );
    const nonCovidPatients = Math.floor(totalBeds * nonCovidUtilization);
    return {
      series: actualTimeseries.map(row => nonCovidPatients),
      method: NonCovidPatientsMethod.ESTIMATED_FROM_TYPICAL_UTILIZATION,
    };
  }
}
