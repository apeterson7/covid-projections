/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Run 'yarn update-api-types' to regenerate.
 */

export type Countryname = string;
/**
 * Fips Code.  For state level data, 2 characters, for county level data, 5 characters.
 */
export type Fips = string;
/**
 * Latitude of point within the state or county
 */
export type Lat = number;
/**
 * Longitude of point within the state or county
 */
export type Long = number;
/**
 * The state name
 */
export type Statename = string;
/**
 * The county name
 */
export type Countyname = string;
/**
 * Date of latest data
 */
export type Lastupdateddate = string;
/**
 * Projection about total hospital bed utilization
 */
export type Totalhospitalbeds = ResourceUsageProjection;
/**
 * Shortfall of resource needed at the peak utilization
 */
export type Peakshortfall = number;
/**
 * Date of peak resource utilization
 */
export type Peakdate = string;
/**
 * Date when resource shortage begins
 */
export type Shortagestartdate = string;
/**
 * Projection about ICU hospital bed utilization
 */
export type Icubeds = ResourceUsageProjection;
/**
 * Historical or Inferred Rt
 */
export type Rt = number;
/**
 * Rt standard deviation
 */
export type Rtci90 = number;
/**
 * Total population in geographic region [*deprecated*: refer to summary for this]
 */
export type Population = number;
/**
 * Name of high-level intervention in-place
 */
export type Intervention = string;
/**
 * Number of confirmed cases so far
 */
export type Cumulativeconfirmedcases = number;
/**
 * Number of positive test results to date
 */
export type Cumulativepositivetests = number;
/**
 * Number of negative test results to date
 */
export type Cumulativenegativetests = number;
/**
 * Number of deaths so far
 */
export type Cumulativedeaths = number;
/**
 * *deprecated*: Capacity for resource. In the case of ICUs, this refers to total capacity. For hospitalization this refers to free capacity for COVID patients. This value is calculated by (1 - typicalUsageRate) * totalCapacity * 2.07
 */
export type Capacity = number;
/**
 * Total capacity for resource.
 */
export type Totalcapacity = number;
/**
 * Currently used capacity for resource by COVID
 */
export type Currentusagecovid = number;
/**
 * Currently used capacity for resource by all patients (COVID + Non-COVID)
 */
export type Currentusagetotal = number;
/**
 * Typical used capacity rate for resource. This excludes any COVID usage.
 */
export type Typicalusagerate = number;
/**
 * # of Contact Tracers
 */
export type Contacttracers = number;
/**
 * Total Population in geographic region.
 */
export type Population1 = number;
export type Date = string;
/**
 * Number of hospital beds projected to be in-use or that were actually in use (if in the past)
 */
export type Hospitalbedsrequired = number;
/**
 * Number of hospital beds projected to be in-use or actually in use (if in the past)
 */
export type Hospitalbedcapacity = number;
/**
 * Number of ICU beds projected to be in-use or that were actually in use (if in the past)
 */
export type Icubedsinuse = number;
/**
 * Number of ICU beds projected to be in-use or actually in use (if in the past)
 */
export type Icubedcapacity = number;
/**
 * Number of ventilators projected to be in-use.
 */
export type Ventilatorsinuse = number;
/**
 * Total ventilator capacity.
 */
export type Ventilatorcapacity = number;
/**
 * Historical or Inferred Rt
 */
export type Rtindicator = number;
/**
 * Rt standard deviation
 */
export type Rtindicatorci90 = number;
/**
 * Number of cumulative deaths
 */
export type Cumulativedeaths1 = number;
/**
 * Number of cumulative infections
 */
export type Cumulativeinfected = number;
/**
 * Number of current infections
 */
export type Currentinfected = number;
/**
 * Number of people currently susceptible
 */
export type Currentsusceptible = number;
/**
 * Number of people currently exposed
 */
export type Currentexposed = number;
export type Timeseries = PredictionTimeseriesRow[];
/**
 * Total population in geographic region [*deprecated*: refer to summary for this]
 */
export type Population2 = number;
/**
 * Name of high-level intervention in-place
 */
export type Intervention1 = string;
/**
 * Number of confirmed cases so far
 */
export type Cumulativeconfirmedcases1 = number;
/**
 * Number of positive test results to date
 */
export type Cumulativepositivetests1 = number;
/**
 * Number of negative test results to date
 */
export type Cumulativenegativetests1 = number;
/**
 * Number of deaths so far
 */
export type Cumulativedeaths2 = number;
/**
 * # of Contact Tracers
 */
export type Contacttracers1 = number;
export type Date1 = string;
export type Actualstimeseries = ActualsTimeseriesRow[];

/**
 * Base model for API output.
 */
export interface RegionSummaryWithTimeseries {
  countryName?: Countryname;
  fips: Fips;
  lat: Lat;
  long: Long;
  stateName: Statename;
  countyName?: Countyname;
  lastUpdatedDate: Lastupdateddate;
  projections: Projections;
  actuals: Actuals;
  population: Population1;
  timeseries: Timeseries;
  actualsTimeseries: Actualstimeseries;
}
/**
 * Base model for API output.
 */
export interface Projections {
  totalHospitalBeds: Totalhospitalbeds;
  ICUBeds: Icubeds;
  Rt: Rt;
  RtCI90: Rtci90;
}
/**
 * Base model for API output.
 */
export interface ResourceUsageProjection {
  peakShortfall: Peakshortfall;
  peakDate: Peakdate;
  shortageStartDate: Shortagestartdate;
}
/**
 * Base model for API output.
 */
export interface Actuals {
  population: Population;
  intervention: Intervention;
  cumulativeConfirmedCases: Cumulativeconfirmedcases;
  cumulativePositiveTests: Cumulativepositivetests;
  cumulativeNegativeTests: Cumulativenegativetests;
  cumulativeDeaths: Cumulativedeaths;
  hospitalBeds: ResourceUtilization;
  ICUBeds: ResourceUtilization;
  contactTracers?: Contacttracers;
}
/**
 * Base model for API output.
 */
export interface ResourceUtilization {
  capacity: Capacity;
  totalCapacity: Totalcapacity;
  currentUsageCovid: Currentusagecovid;
  currentUsageTotal: Currentusagetotal;
  typicalUsageRate: Typicalusagerate;
}
/**
 * Base model for API output.
 */
export interface PredictionTimeseriesRow {
  date: Date;
  hospitalBedsRequired: Hospitalbedsrequired;
  hospitalBedCapacity: Hospitalbedcapacity;
  ICUBedsInUse: Icubedsinuse;
  ICUBedCapacity: Icubedcapacity;
  ventilatorsInUse: Ventilatorsinuse;
  ventilatorCapacity: Ventilatorcapacity;
  RtIndicator: Rtindicator;
  RtIndicatorCI90: Rtindicatorci90;
  cumulativeDeaths: Cumulativedeaths1;
  cumulativeInfected: Cumulativeinfected;
  currentInfected: Currentinfected;
  currentSusceptible: Currentsusceptible;
  currentExposed: Currentexposed;
}
/**
 * Base model for API output.
 */
export interface ActualsTimeseriesRow {
  population: Population2;
  intervention: Intervention1;
  cumulativeConfirmedCases: Cumulativeconfirmedcases1;
  cumulativePositiveTests: Cumulativepositivetests1;
  cumulativeNegativeTests: Cumulativenegativetests1;
  cumulativeDeaths: Cumulativedeaths2;
  hospitalBeds: ResourceUtilization;
  ICUBeds: ResourceUtilization;
  contactTracers?: Contacttracers1;
  date: Date1;
}
