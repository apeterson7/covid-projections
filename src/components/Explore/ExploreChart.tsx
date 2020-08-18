import React, { FunctionComponent } from 'react';
import moment from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { scaleTime, scaleLinear, scaleLog } from '@vx/scale';
import { GridRows, GridColumns } from '@vx/grid';
import { Group } from '@vx/group';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Column } from 'common/models/Projection';
import * as ChartStyle from 'components/Charts/Charts.style';
import RectClipGroup from 'components/Charts/RectClipGroup';
import { Series, YAxisScale } from './interfaces';
import SeriesChart from './SeriesChart';
import { getMaxBy, getTimeAxisTicks } from './utils';
import * as Styles from './Explore.style';

const getDate = (d: Column) => new Date(d.x);
const getY = (d: Column) => d.y;

function getYAxisScale(yAxisScale: YAxisScale, maxY: number, height: number) {
  return yAxisScale === YAxisScale.LINEAR
    ? scaleLinear({
        domain: [0, maxY],
        range: [height, 0],
      })
    : scaleLog({
        domain: [1, maxY],
        range: [height, 0],
      });
}

const ExploreChart: FunctionComponent<{
  width: number;
  height: number;
  series: Series[];
  yAxisScale: YAxisScale;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}> = ({
  width,
  height,
  series,
  yAxisScale,
  marginTop = 10,
  marginBottom = 30,
  marginLeft = 50,
  marginRight = 10,
}) => {
  const minX = new Date('2020-03-01');
  const maxX = new Date();
  const numDays = moment(maxX).diff(minX, 'days');
  const maxY = getMaxBy<number>(series, getY, 1);

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const timeScale = scaleTime({
    domain: [minX, maxX],
    range: [0, innerWidth],
  });
  const timeTicks = getTimeAxisTicks(minX, maxX);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const timeTickFormat = isMobile ? 'MMM' : 'MMMM D';

  const yScale = getYAxisScale(yAxisScale, maxY, innerHeight);

  const barWidth = 0.7 * (innerWidth / numDays);

  return (
    <svg width={width} height={height}>
      <Group key="main-chart" top={marginTop} left={marginLeft}>
        <RectClipGroup width={innerWidth} height={innerHeight}>
          {series.map((serie, i) => (
            <SeriesChart
              key={`series-chart-${i}`}
              data={serie.data}
              x={d => timeScale(getDate(d)) || 0}
              y={d => yScale(Math.max(getY(d), 1))}
              type={serie.type}
              yMax={innerHeight}
              barWidth={barWidth}
            />
          ))}
        </RectClipGroup>
      </Group>
      <Group key="axes" top={marginTop} left={marginLeft}>
        <Styles.GridLines>
          <GridColumns<Date> scale={timeScale} height={innerHeight} />
          <GridRows<number> scale={yScale} width={innerWidth} />
        </Styles.GridLines>
        <ChartStyle.Axis>
          <AxisLeft scale={yScale} />
        </ChartStyle.Axis>
        <ChartStyle.Axis>
          <AxisBottom
            top={innerHeight}
            scale={timeScale}
            tickValues={timeTicks}
            tickFormat={(date: Date) => moment(date).format(timeTickFormat)}
          />
        </ChartStyle.Axis>
      </Group>
    </svg>
  );
};

export default ExploreChart;
