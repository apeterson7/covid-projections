import styled, { css } from 'styled-components';
import { isNumber } from 'lodash';
import { TableHead, TableCell, TableRow, Modal } from '@material-ui/core';
import {
  COLOR_MAP,
  LEVEL_COLOR,
  LEVEL_COLOR_CONTACT_TRACING,
} from 'common/colors';
import { COLORS } from 'common';
import { Metric } from 'common/metric';
import { Level } from 'common/level';
import { ChartLocationName } from 'components/LocationPage/ChartsHolder.style';

// TODO (Chelsi): consolidate into a theme:

export const locationNameCellWidth = 195;
export const metricCellWidth = 110;

const getMetricHeaderBackground = (
  sortByPopulation: boolean,
  isModal: Boolean,
  isSelectedMetric: boolean,
) => {
  if (isModal) {
    if (isSelectedMetric && !sortByPopulation) return 'black';
    return `${COLOR_MAP.GRAY_BODY_COPY}`;
  } else {
    if (isSelectedMetric && !sortByPopulation) return `${COLOR_MAP.BLUE}`;
    return 'white';
  }
};

export const CenteredContentModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Wrapper = styled.div<{ isModal?: Boolean; isHomepage?: boolean }>`
  max-width: ${({ isHomepage }) => (isHomepage ? '1000px' : '900px')};
  width: 100%;
  margin: ${({ isModal }) => (isModal ? '0 auto' : '1rem auto')};
  background: ${({ isModal }) => isModal && `${COLOR_MAP.GRAY_BODY_COPY}`};
  max-height: ${({ isModal }) => isModal && '100vh'};

  @media (min-width: 600px) {
    margin: ${({ isModal }) => (isModal ? '0 auto' : '3rem auto')};
    max-height: ${({ isModal }) => (isModal ? '80vh' : 'unset')};
  }

  @media (min-width: 1060px) {
    margin: ${({ isModal }) => (isModal ? '0 auto' : '3rem auto 2rem')};
  }

  @media (min-width: 1350px) {
    margin: ${({ isModal }) => (isModal ? '0 auto' : '3rem 445px 2rem auto')};
  }

  @media (min-width: 1750px) {
    margin: ${({ isModal }) => (isModal ? '0 auto' : '3rem auto 2rem')};
  }

  table {
    border-spacing: 0;

    th,
    td {
      &:first-child {
        width: 27.5%;
        min-width: ${locationNameCellWidth}px;
      }

      &:not(:first-child) {
        width: 14.5%;
        min-width: ${metricCellWidth}px;
      }
    }

    a {
      display: table;
      color: black;
      width: 100%;
    }
  }

  ${ChartLocationName} {
    margin: 0.25rem 0;
  }
`;

export const ArrowContainer = styled.div<{
  arrowColorNotSelected: string;
  isModal?: Boolean;
}>`
  color: #bdbdbd;
  font-family: Roboto;
  font-size: 0.875rem;
  transform: translate(-0.25rem, 0.15rem);
  margin-top: 0.25rem;
  display: flex;

  span {
    margin: auto 0 auto 0.25rem;
  }

  svg {
    color: ${({ arrowColorNotSelected }) => arrowColorNotSelected};

    &:hover {
      color: ${({ isModal }) => (isModal ? 'white' : 'black')};
    }
  }
`;

export const CellStyles = css`
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

export const LocationHeaderCell = styled(TableCell)<{
  isModal: Boolean;
  sortByPopulation: boolean;
  arrowColorSelected: string;
  arrowColorNotSelected: string;
  sortDescending: boolean;
}>`
  ${CellStyles}

  background-color: ${({ isModal, sortByPopulation }) =>
    isModal && sortByPopulation
      ? 'black'
      : isModal
      ? `${COLOR_MAP.GRAY_BODY_COPY}`
      : sortByPopulation
      ? `${COLOR_MAP.BLUE}`
      : 'white'};

  border-radius: ${({ sortByPopulation }) => sortByPopulation && '4px 4px 0 0'};
  color: ${({ isModal, sortByPopulation }) =>
    !isModal && sortByPopulation && 'white'};

  ${ArrowContainer} {
    svg{
      &:first-child {
        color: ${({ arrowColorSelected, sortByPopulation }) =>
          sortByPopulation && `${arrowColorSelected}`};
        opacity: ${({ sortDescending, sortByPopulation }) =>
          sortDescending && sortByPopulation && '.5'};
      }
      &:nth-child(2){
        transform: translatex(-0.1rem);
        color: ${({ arrowColorSelected, sortByPopulation }) =>
          sortByPopulation && `${arrowColorSelected}`};
        opacity: ${({ sortDescending, sortByPopulation }) =>
          !sortDescending && sortByPopulation && '.5'};
      }
      &:hover{
        color: ${({ arrowColorSelected, sortByPopulation }) =>
          sortByPopulation && `${arrowColorSelected}`};
        opacity: 1;
      }
    }
  }

  span{
    color: ${COLOR_MAP.GRAY.DARK};
    font-weight: normal;
    color: ${({ isModal, sortByPopulation }) =>
      !isModal && sortByPopulation ? 'white' : `${COLOR_MAP.GRAY.DARK}`};

  }
`;

export const MetricHeaderCell = styled(TableCell)<{
  isModal: Boolean;
  sortByPopulation: boolean;
  arrowColorSelected: string;
  sortDescending: boolean;
  isSelectedMetric: boolean;
}>`
  ${CellStyles}

  border-radius: ${({ sortByPopulation, isSelectedMetric }) =>
    !sortByPopulation && isSelectedMetric && '4px 4px 0 0'};
  background-color: ${props =>
    getMetricHeaderBackground(
      props.sortByPopulation,
      props.isModal,
      props.isSelectedMetric,
    )};
    color: ${({ sortByPopulation, isSelectedMetric }) =>
      !sortByPopulation && isSelectedMetric && 'white'};

    ${ArrowContainer} {
      svg{
        &:nth-child(2) {
          transform: translatex(-0.1rem);
          color: ${({
            arrowColorSelected,
            sortByPopulation,
            isSelectedMetric,
          }) =>
            !sortByPopulation && isSelectedMetric && `${arrowColorSelected}`};
          opacity: ${({ sortDescending, sortByPopulation, isSelectedMetric }) =>
            !sortDescending && !sortByPopulation && isSelectedMetric && '.5'};
        }
        &:first-child {
          color: ${({
            arrowColorSelected,
            sortByPopulation,
            isSelectedMetric,
          }) =>
            !sortByPopulation && isSelectedMetric && `${arrowColorSelected}`};
          opacity: ${({ sortDescending, sortByPopulation, isSelectedMetric }) =>
            sortDescending && !sortByPopulation && isSelectedMetric && '.5'};
        }
        &:hover{
          color: ${({
            arrowColorSelected,
            sortByPopulation,
            isSelectedMetric,
          }) =>
            !sortByPopulation && isSelectedMetric && `${arrowColorSelected}`};
            opacity: 1;
        }
      }
    }
`;

export const TableHeadContainer = styled(TableHead)<{ isModal?: Boolean }>`
  ${MetricHeaderCell}, ${LocationHeaderCell} {
    vertical-align: bottom;
    line-height: 1.1rem;
    padding: 1rem 1rem 0.8rem;
    color: ${({ isModal }) => isModal && 'white'};
    border-bottom: ${({ isModal }) =>
      !isModal && `2px solid ${COLORS.LIGHTGRAY}`};
  }
`;

export const Population = styled.span`
  font-family: Source Code Pro;
  font-size: 0.875rem;
`;

export const LocationInfoWrapper = styled.div``;

export const CountySuffix = styled.div`
  font-weight: normal;
  margin-right: 0.25rem;
`;

export const MetricCell = styled.td<{
  countyName?: Boolean;
  iconColor?: Level;
  sorter?: any;
  metric?: Metric;
  sortByPopulation: boolean;
}>`
  text-align: left;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  cursor: pointer;

  &:first-child {
    min-width: ${locationNameCellWidth}px;
    background-color: ${({ sortByPopulation }) =>
      sortByPopulation && 'rgba(0,0,0,0.02)'};
    font-weight: 500;
    line-height: 1.2;

    span {
      color: ${COLOR_MAP.GRAY.DARK};
    }
  }

  &:not(:first-child) {
    min-width: ${metricCellWidth}px;
    font-family: Source Code Pro;
    color: ${({ sorter, metric }) =>
      sorter === metric ? 'black' : `${COLOR_MAP.GRAY_BODY_COPY}`};
    font-weight: ${({ sorter, metric, sortByPopulation }) =>
      !sortByPopulation && sorter === metric && '600'};
    background-color: ${({ sorter, metric, sortByPopulation }) =>
      !sortByPopulation && sorter === metric && 'rgba(0,0,0,0.02)'};
  }

  svg {
    margin-right: 0.4rem;
    font-size: 0.75rem;
    color: ${({ iconColor }) =>
      iconColor !== undefined && `${LEVEL_COLOR[iconColor]}`};
  }

  span {
    font-family: Source Code Pro;
    color: ${COLOR_MAP.GRAY_BODY_COPY};
    margin-right: 0.75rem;
  }

  ${Population} {
    margin-right: 0.5rem;
  }

  ${LocationInfoWrapper} {
    display: flex;
    align-items: center;
  }

  &:last-child {
    svg {
      color: ${({ iconColor }) =>
        iconColor !== undefined && `${LEVEL_COLOR_CONTACT_TRACING[iconColor]}`};
    }
  }

  div {
    display: inline-block;

    &:first-child {
      vertical-align: top;
    }
  }
`;

export const MetricValue = styled.span<{ valueUnknown: boolean }>`
  width: 48px;
  display: inline-block;
  text-align: right;
  opacity: ${({ valueUnknown }) => valueUnknown && '.5'};
`;

export const Tag = styled.div`
  border-radius: 5px;
  font-size: 0.875rem;
  padding: 0.2rem 0.35rem;
  font-weight: bold;
  color: ${COLOR_MAP.GRAY_BODY_COPY};
  background: ${COLORS.LIGHTGRAY};
`;

export const Row = styled(TableRow)<{
  index?: number;
  isCurrentCounty?: boolean;
  isModal?: boolean;
  headerRowBackground?: string;
}>`
  background-color: ${({ index, headerRowBackground }) =>
    !isNumber(index)
      ? `${headerRowBackground}`
      : index % 2 === 0
      ? '#fafafa'
      : 'white'};
  background-color: ${({ isModal }) =>
    isModal && `${COLOR_MAP.GRAY_BODY_COPY}`};
  background-color: ${({ isCurrentCounty }) => isCurrentCounty && '#FFEFD6'};
  border-bottom: none;

  th {
    border-bottom: none;
  }

  &:hover {
    color: ${({ headerRowBackground }) =>
      !headerRowBackground && `${COLOR_MAP.BLUE}`};
    ${MetricCell} {
      span,
      ${Tag} {
        color: ${COLOR_MAP.BLUE};
      }
    }
  }
`;

export const Footer = styled.div<{ isCounty: any }>`
  display: flex;
  padding: 1.25rem 0.75rem;
  color: ${COLOR_MAP.GRAY_BODY_COPY};
  font-size: 0.875rem;
  justify-content: space-between;

  span {
    margin-right: 1rem;
  }

  div {
    &:first-child {
      display: flex;
      flex-direction: column;
    }
  }

  @media (min-width: 600px) {
    div {
      &:first-child {
        flex-direction: row;
      }
    }
  }
`;

export const FooterLink = styled.div`
  font-family: Roboto;
  color: ${COLOR_MAP.BLUE};
  font-weight: 500;
  cursor: pointer;

  @media (min-width: 600px) {
    &:last-child {
      margin-left: auto;
    }
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
`;

export const Header = styled.div<{ centered?: boolean }>`
  display: flex;
  font-family: Roboto;
  font-weight: bold;
  font-size: 1.5rem;
  margin: ${({ centered }) => centered && '0 auto'};

  @media (min-width: 600px) {
    font-size: ${({ centered }) => (centered ? '2rem' : '1.5rem')};
  }
`;

export const ModalHeader = styled.div<{ isHomepage?: boolean }>`
  background-color: ${COLOR_MAP.GRAY_BODY_COPY};
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1rem 1rem 1.25rem;
  align-items: center;
  max-width: ${({ isHomepage }) => (isHomepage ? '1000px' : '900px')};
  width: 100%;
  margin: 0 auto;

  @media (min-width: 600px) {
    margin: 1rem auto 0;
  }

  svg {
    color: white;
    cursor: pointer;
    font-size: 1.75rem;
    margin-bottom: auto;
  }
`;

export const DivForRef = styled.div``;

export const StateName = styled.div`
  font-size: 0.9rem;
  line-height: 1.2;
`;
