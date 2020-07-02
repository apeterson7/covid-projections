import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import palette from 'assets/theme/palette';
import { COLORS } from 'common';
import { COLOR_MAP } from 'common/colors';
// import { Level } from 'common/level';

export const ColoredHeaderBanner = styled(Box)<{ hasStats?: Boolean }>`
  display: flex;
  flex-direction: column;
  height: 400px;
  background-color: ${props => props.bgcolor || COLORS.LIGHTGRAY};

  @media (min-width: 600px) {
    height: ${({ hasStats }) => (!hasStats ? '318px' : '380px')};
  }
`;

export const Wrapper = styled(Box)<{
  condensed?: Boolean;
  headerTopMargin: number;
  headerBottomMargin: number;
}>`
  ${props =>
    props.condensed
      ? `
    display: block;
  `
      : `
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    background-color: unset;
    box-shadow: none;
    max-width: 1040px;
    flex-direction: column;
    cursor: pointer;
    margin: -380px 1rem 0 1rem;

    @media (min-width: 600px) {
      position: relative;
      flex-direction: column;
      margin: ${props.headerTopMargin}px 1rem ${props.headerBottomMargin}px;
    }

    @media (min-width: 932px) {
      margin: ${props.headerTopMargin}px auto ${props.headerBottomMargin}px;
    }
    @media (min-width: 1350px) {
      margin: ${props.headerTopMargin}px 445px ${props.headerBottomMargin}px auto;
    }
    @media (min-width: 1750px) {
      margin: ${props.headerTopMargin}px auto ${props.headerBottomMargin}px;
    }
  `}
`;

export const TopContainer = styled(Box)`
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background-color: white;
`;

export const HeaderSection = styled(Box)`
  display: flex;
  flex-direction: column;
  cursor: default;

  &:nth-child(2) {
    background-color: #fafafa;
  }

  &:last-child {
    justify-content: space-between;
  }

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const LocationCopyWrapper = styled(Box)`
  line-height: 1.4;
  margin: 1.5rem 1rem;

  @media (min-width: 600px) {
    margin: 2.25rem 0.875rem 2.25rem 2.25rem;
  }
`;

export const HeaderTitle = styled(Typography)<{
  isEmbed?: Boolean;
}>`
  color: ${palette.black};
  font-size: ${props => (props.isEmbed ? '1.8rem' : '22px')};
  font-weight: normal;
  line-height: ${props => (props.isEmbed ? '1.5rem' : '2.2rem')};
  padding: 0;
  text-align: center;

  a {
    color: ${palette.black};
    text-decoration: none;
  }

  @media (min-width: 600px) {
    font-size: 30px;
    text-align: left;
  }
`;

export const HeaderSubtitle = styled(Typography)`
  font-size: 15px;
  line-height: 1.4;
  color: #4f4f4f;
  margin-top: 1.2rem;

  @media (min-width: 600px) {
    font-size: 16px;
    margin-top: 1rem;
  }
`;

export const FooterContainer = styled(Box)<{
  isVerifiedState?: Boolean;
}>`
  margin: ${({ isVerifiedState }) =>
    isVerifiedState ? '.4rem .2rem 1rem .2rem;' : '1rem .2rem 1rem .2rem'};

  p {
    padding: 0;
  }

  svg {
    transform: translateY(0.75rem);
    margin-right: 0.75rem;
  }

  @media (min-width: 600px) {
    max-width: 600px;
    width: 100%;
    margin: ${({ isVerifiedState }) =>
      isVerifiedState ? '.4rem 0 0 .2rem' : '.4rem 0 0 .2rem'};
    cursor: auto;

    a {
      cursor: pointer;
    }

    svg {
      transform: translateY(0.35rem);
    }
  }
`;

export const HeaderSubCopy = styled(Typography)`
  color: #828282;
  font-size: 13px;
  line-height: 1.4;
  padding: 1.5rem 0 0.2rem;
  font-family: Source Code Pro;

  svg {
    margin: 0 0.5rem 0 0;
    flex-shrink: 0;
  }

  // @media (min-width: 600px) {
  //   font-size: 14px;
  // }
`;

export const ButtonsWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-right: 1.5rem;
  background-color: white;
  border-radius: 0 0 8px 8px;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (min-width: 600px) {
    width: fit-content;
    background-color: unset;
    border-radius: 0;
    margin-bottom: 0;
  }
`;

export const HeaderButton = styled(Box)`
  font-size: 13px;
  line-height: 1.2;
  cursor: pointer;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${COLOR_MAP.GRAY.LIGHT};
  border-radius: 4px;
  text-transform: uppercase;
  padding: 0.5rem 0.75rem;
  letter-spacing: 0.02em;

  &:first-child {
    color: ${COLOR_MAP.BLUE};
    margin-right: 1.25rem;
  }

  &:last-child {
    color: ${COLOR_MAP.RED.BASE};
  }

  svg {
    margin-right: 6px;
  }

  @media (min-width: 600px) {
    font-size: 14px;
    padding: 0.75rem 1.75rem;
    margin: auto;

    &:first-child {
      margin-right: 1.5rem;
    }
  }
`;

export const LastUpdatedDate = styled.span<{
  isVerifiedState?: Boolean;
}>`
  display: flex;
  margin-left: ${({ isVerifiedState }) => isVerifiedState && '32px'};

  @media (min-width: 600px) {
    display: inline;
    margin-left: 0;
    margin-bottom: 10px;
  }
`;

export const SectionHalf = styled(Box)`
  display: flex;
  justify-content: space-between;

  &:first-child {
    margin: 2rem 1.6rem;
  }

  &:last-child {
    margin: 0 1.6rem 2rem;
  }

  svg {
    color: #bdbdbd;
  }

  @media (min-width: 600px) {
    &:first-child {
      flex: 3;
      margin: 2rem 2rem 2.25rem;
    }

    &:last-child {
      flex: 2;
      margin: 2rem 2rem 2.25rem 0;
    }
  }
`;

export const SectionColumn = styled(Box)<{ isUpdateCopy?: Boolean }>`
  display: flex;
  flex-direction: column;
  margin-left: ${({ isUpdateCopy }) => (isUpdateCopy ? '1rem' : '1.5rem')};
`;

export const ColumnTitle = styled(Typography)`
  font-family: Roboto;
  font-size: 13px;
  text-transform: uppercase;
  color: #828282;
  letter-spacing: 0.02rem;
  margin-bottom: 0.6rem;
`;

export const Copy = styled(Typography)<{ isUpdateCopy?: Boolean }>`
  font-family: Source Code Pro;
  font-size: ${({ isUpdateCopy }) => (isUpdateCopy ? '13px' : '12px')};
  line-height: 140%;
  color: #4f4f4f;

  strong {
    color: black;
  }

  @media (min-width: 600px) {
    font-size: 13px;
  }
`;

export const LevelDescription = styled(Typography)`
  font-family: Source Code Pro;
  font-size: 16px;
  line-height: 140%;
  font-weight: bold;
  margin-bottom: 0.6rem;

  @media (min-width: 600px) {
    font-size: 18px;
  }
`;

export const ThermometerContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 20px;
  margin: 0 auto;
`;

export const ThermometerRow = styled(Box)<{
  isCurrentLevel?: Boolean;
  color: string;
}>`
  display: flex;
  flex-direction: row;
  border: ${({ isCurrentLevel }) => isCurrentLevel && `4px solid black`};
  background-color: ${({ color }) => color};
  height: 32px;
  width: ${({ isCurrentLevel }) => (isCurrentLevel ? '24px' : '20px')};
  align-self: center;

  &:first-child {
    border-radius: 99px 99px 0 0;
  }

  &:last-child {
    border-radius: 0 0 99px 99px;
  }
`;
