import { Projection } from './Projection';
import { STATES } from '..';
import { Metric, getLevel, ALL_METRICS } from 'common/metric';
import { Level } from 'common/level';
import { LEVEL_COLOR } from 'common/colors';
import { fail } from 'common/utils';
import { LocationSummary, MetricSummary } from 'common/location_summaries';
import { RegionSummaryWithTimeseries } from 'api/schema/RegionSummaryWithTimeseries';

/**
 * The complete set of data / metrics and related information for a given
 * location (state or county).
 *
 * TODO(michael): Rename / restructure this and the Projection class now that
 * we're not focused on projections and there's only 1.
 */
export class Projections {
  stateCode: string;
  stateName: string;
  county: any;
  countyName: string | null;
  primary: Projection;
  isCounty: boolean;

  constructor(
    summaryWithTimeseries: RegionSummaryWithTimeseries,
    stateCode: string,
    county?: any,
  ) {
    this.stateCode = stateCode.toUpperCase();
    this.stateName = (STATES as any)[this.stateCode];
    this.county = null;
    this.countyName = null;
    this.isCounty = county != null;
    this.primary = new Projection(summaryWithTimeseries, {
      isCounty: this.isCounty,
    });

    this.populateCounty(county);
  }

  populateCounty(county: any) {
    if (!county) {
      return;
    }

    this.county = county;
    this.countyName = county.county;

    const NEW_YORK_COUNTIES_BLACKLIST = [
      'Kings County',
      'Queens County',
      'Bronx County',
      'Richmond County',
    ];

    if (
      this.stateCode === 'NY' &&
      NEW_YORK_COUNTIES_BLACKLIST.includes(this.countyName!)
    ) {
      this.countyName = 'New York';
    }
  }

  get fips(): string {
    return this.primary.fips;
  }

  get locationName(): string {
    if (this.isCounty) {
      return `${this.countyName}, ${this.stateCode}`;
    } else {
      return this.stateName;
    }
  }

  get population(): number {
    return this.primary.totalPopulation;
  }

  get summary(): LocationSummary {
    const metrics = {} as { [metric in Metric]: MetricSummary };
    for (const metric of ALL_METRICS) {
      metrics[metric] = {
        value: this.getMetricValue(metric),
        level: this.getMetricLevel(metric),
      };
    }

    return {
      level: this.getAlarmLevel(),
      metrics,
    };
  }

  hasMetric(metric: Metric): boolean {
    return this.getMetricValue(metric) !== null;
  }

  getMetricValue(metric: Metric): number | null {
    switch (metric) {
      case Metric.CASE_GROWTH_RATE:
        return this.primary.rt;
      case Metric.HOSPITAL_USAGE:
        return this.primary.icuHeadroomInfo?.metricValue || null;
      case Metric.POSITIVE_TESTS:
        return this.primary.currentTestPositiveRate;
      case Metric.CONTACT_TRACING:
        return this.primary.currentContactTracerMetric;
      case Metric.CASE_DENSITY:
        return this.primary.currentCaseDensity;
      default:
        fail('Cannot get value of metric: ' + metric);
    }
  }

  getMetricValues(): { [metric in Metric]: number | null } {
    const result = {} as { [metric in Metric]: number | null };
    for (const metric of ALL_METRICS) {
      result[metric] = this.getMetricValue(metric);
    }
    return result;
  }

  getMetricLevel(metric: Metric): Level {
    return getLevel(metric, this.getMetricValue(metric));
  }

  // TODO(michael): Rework this to return a { [metric in Metric]: Level } map
  // instead of using the custom "rt_level", etc. keys.
  getLevels(): {
    rt_level: Level;
    hospitalizations_level: Level;
    test_rate_level: Level;
    contact_tracing_level: Level;
    case_density: Level;
  } {
    return {
      rt_level: this.getMetricLevel(Metric.CASE_GROWTH_RATE),
      hospitalizations_level: this.getMetricLevel(Metric.HOSPITAL_USAGE),
      test_rate_level: this.getMetricLevel(Metric.POSITIVE_TESTS),
      contact_tracing_level: this.getMetricLevel(Metric.CONTACT_TRACING),
      case_density: this.getMetricLevel(Metric.CASE_DENSITY),
    };
  }

  getAlarmLevel(): Level {
    const {
      rt_level,
      hospitalizations_level,
      test_rate_level,
      contact_tracing_level,
      case_density,
    } = this.getLevels();

    // If case density is low, it overrides other metrics.
    if (case_density === Level.LOW) {
      return Level.LOW;
    }

    const levelList = [
      rt_level,
      hospitalizations_level,
      test_rate_level,
      case_density,
    ];

    // contact tracing levels are reversed (i.e low is bad, high is good)
    const reverseList = [contact_tracing_level];

    if (
      levelList.some(level => level === Level.CRITICAL) ||
      reverseList.some(level => level === Level.LOW)
    ) {
      return Level.CRITICAL;
    } else if (
      levelList.some(level => level === Level.HIGH) ||
      reverseList.some(level => level === Level.MEDIUM)
    ) {
      return Level.HIGH;
    } else if (
      levelList.some(level => level === Level.MEDIUM) ||
      reverseList.some(level => level === Level.HIGH)
    ) {
      return Level.MEDIUM;
    } else if (
      levelList.some(level => level === Level.UNKNOWN) ||
      reverseList.some(level => level === Level.UNKNOWN)
    ) {
      return Level.UNKNOWN;
    } else {
      return Level.LOW;
    }
  }

  getAlarmLevelColor() {
    const level = this.getAlarmLevel();
    return LEVEL_COLOR[level];
  }
}
