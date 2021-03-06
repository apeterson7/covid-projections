/**
 * Helpers for fetching API endpoints and returning them using the typed API
 * schema definitions.
 */

import DataUrlJson from 'assets/data/data_url.json';
import {
  RegionSummaryWithTimeseries,
  Actualstimeseries,
} from './schema/RegionSummaryWithTimeseries';
import { AggregateRegionSummaryWithTimeseries } from './schema/AggregateRegionSummaryWithTimeseries';
import {
  RegionAggregateDescriptor,
  RegionDescriptor,
} from '../common/utils/RegionDescriptor';
import { fail, assert } from 'common/utils';
import fetch from 'node-fetch';

export const SNAPSHOT_URL = DataUrlJson.data_url;

// We always use the "observed" intervention (i.e. projected based on current trends).
const INTERVENTION = 'OBSERVED_INTERVENTION';

/** Represents the actuals timeseries for any kind of region */
export type ActualsTimeseries = Actualstimeseries;

export interface SnapshotVersion {
  timestamp: string;
  'covid-data-public': string;
  'covid-data-model': string;
}

export class Api {
  readonly snapshotUrl: string;
  constructor(dataUrl?: string | null) {
    this.snapshotUrl = dataUrl || SNAPSHOT_URL;
    // trim any trailing /
    this.snapshotUrl = this.snapshotUrl.replace(/\/$/, '');
  }

  /**
   * Fetches the summary+timeseries for every region in the specified region
   * aggregate (e.g. all counties or all states).
   */
  async fetchAggregatedSummaryWithTimeseries(
    regionAggregate: RegionAggregateDescriptor,
  ): Promise<RegionSummaryWithTimeseries[]> {
    const all = await this.fetchApiJson<AggregateRegionSummaryWithTimeseries>(
      `us/${regionAggregate}.${INTERVENTION}.timeseries.json`,
    );
    assert(all != null, 'Failed to load timeseries');
    return all;
  }

  /**
   * Fetches the summary+timeseries for a region. Returns null if not found.
   */
  async fetchSummaryWithTimeseries(
    region: RegionDescriptor,
  ): Promise<RegionSummaryWithTimeseries | null> {
    if (region.isState()) {
      return await this.fetchApiJson<RegionSummaryWithTimeseries>(
        `us/states/${region.stateId}.${INTERVENTION}.timeseries.json`,
      );
    } else if (region.isCounty()) {
      return await this.fetchApiJson<RegionSummaryWithTimeseries>(
        `us/counties/${region.countyFipsId}.${INTERVENTION}.timeseries.json`,
      );
    } else {
      fail('Unknown region type: ' + region);
    }
  }

  /** Fetches the ISO Date String at which the API was last updated. */
  async fetchVersionTimestamp(): Promise<string> {
    return await this.fetchApiJson<{ timestamp: string }>('version.json').then(
      data => data!.timestamp,
    );
  }

  /** Fetches the version info for the snapshot. */
  async fetchVersionInfo(): Promise<SnapshotVersion> {
    return await this.fetchApiJson<SnapshotVersion>('version.json').then(
      data => {
        assert(data !== null, 'Failed to fetch version.json');
        return data;
      },
    );
  }

  /**
   * Fetches a URL endpoint and returns the parsed JSON cast to the specified
   * type T, or null if the request fails in any way.
   *
   * TODO: Implement better error-handling.
   */
  private async fetchApiJson<T extends object>(
    endpoint: string,
  ): Promise<T | null> {
    const response = await fetch(`${this.snapshotUrl}/${endpoint}`);
    // TODO(michael): This should really check for 404 only, but S3 currently returns 403s.
    if ((!response.ok && response.status === 404) || response.status === 403) {
      return null;
    }
    return (await response.json()) as T;
  }
}
