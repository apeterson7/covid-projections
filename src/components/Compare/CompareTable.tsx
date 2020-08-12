import React, { useState, Fragment } from 'react';
import { sortBy, findIndex, partition } from 'lodash';
import {
  Wrapper,
  Footer,
  ViewAllLink,
  Header,
  DisclaimerWrapper,
} from 'components/Compare/Compare.style';
import { Metric } from 'common/metric';
import { COLOR_MAP } from 'common/colors';
import LocationTable from './LocationTable';
import { SummaryForCompare, RankedLocationSummary } from 'common/utils/compare';

const CompareTable = (props: {
  stateName?: string;
  county?: any | null;
  setShowModal: any;
  isModal: boolean;
  locationsViewable?: number;
  isHomepage?: Boolean;
  locations: any;
  currentCounty?: any;
}) => {
  const [sorter, setSorter] = useState(5);
  const [sortDescending, setSortDescending] = useState(true);

  const orderedMetrics = [
    Metric.CASE_DENSITY,
    Metric.CASE_GROWTH_RATE,
    Metric.POSITIVE_TESTS,
    Metric.HOSPITAL_USAGE,
    Metric.CONTACT_TRACING,
  ];

  const currentCounty = props.county && props.currentCounty;

  const currentCountyFips = currentCounty
    ? currentCounty.locationInfo.full_fips_code
    : 0;

  const partitionedLocations = partition(
    props.locations,
    location => location.metricsInfo.metrics[sorter].value !== null,
  );
  const sortedLocationsWithValue = sortBy(
    partitionedLocations[0],
    location => location.metricsInfo.metrics[sorter].value,
  );
  const locationsWithNull = partitionedLocations[1];
  let sortedLocationsArr = sortedLocationsWithValue.concat(locationsWithNull);

  if (sortDescending) {
    sortedLocationsWithValue.reverse();
    sortedLocationsArr = sortedLocationsWithValue.concat(locationsWithNull);
  }

  const currentCountyRank = findIndex(
    sortedLocationsArr,
    (location: SummaryForCompare) =>
      location.locationInfo.full_fips_code === currentCountyFips,
  );

  const locationsViewable =
    props.locationsViewable || sortedLocationsArr.length;

  //TODO (chelsi): make this a theme-
  const arrowColorSelected = props.isModal ? 'white' : 'black';
  const arrowColorNotSelected = props.isModal
    ? `${COLOR_MAP.GRAY_BODY_COPY}`
    : `${COLOR_MAP.GRAY.BASE}`;

  const arrowContainerProps = {
    sortDescending,
    sorter,
    arrowColorSelected,
    arrowColorNotSelected,
  };

  const headerCopy = props.isHomepage
    ? 'Compare states'
    : props.county
    ? 'Compare to other counties'
    : 'Compare counties';

  // checks if there are less counties than the default amount shown (10):
  const amountDisplayed =
    props.locationsViewable &&
    sortedLocationsArr.length < props.locationsViewable
      ? sortedLocationsArr.length
      : props.locationsViewable;

  const firstHeaderName = props.isHomepage ? 'State' : 'County';

  const sortedLocations: RankedLocationSummary[] = sortedLocationsArr
    .filter(location => location.metricsInfo !== null)
    .map((summary, i) => ({ rank: i + 1, ...summary }));

  const currentLocation = props.county
    ? { rank: currentCountyRank + 1, ...currentCounty }
    : null;

  const disclaimerRedirect =
    currentCounty &&
    `/us/${currentCounty.locationInfo.state_code.toLowerCase()}/chart/${
      Metric.CONTACT_TRACING
    }`;

  return (
    <Wrapper isModal={props.isModal} isHomepage={props.isHomepage}>
      {!props.isModal && <Header>{headerCopy}</Header>}
      <LocationTable
        firstHeaderName={firstHeaderName}
        setSorter={setSorter}
        setSortDescending={setSortDescending}
        metrics={orderedMetrics}
        isModal={props.isModal}
        {...arrowContainerProps}
        pinnedLocation={currentLocation}
        sortedLocations={sortedLocations}
        numLocations={locationsViewable}
      />
      {!props.isModal && (
        <Fragment>
          <Footer isCounty={props.county}>
            <div>
              {locationsViewable !== sortedLocationsArr.length && (
                <span>
                  Displaying <strong>{amountDisplayed}</strong> of{' '}
                  <strong>{sortedLocationsArr.length}</strong>{' '}
                </span>
              )}
              <ViewAllLink onClick={() => props.setShowModal(true)}>
                {!props.isHomepage
                  ? `View all counties in ${props.stateName}`
                  : 'View all states'}
              </ViewAllLink>
            </div>
            {props.county && (
              <DisclaimerWrapper>
                <span>
                  Most states report contact tracing at the state-level only.
                  View {props.stateName}'s{' '}
                  <a
                    href={disclaimerRedirect}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    contact tracing{' '}
                  </a>
                  data.
                </span>
              </DisclaimerWrapper>
            )}
          </Footer>
        </Fragment>
      )}
    </Wrapper>
  );
};

export default CompareTable;