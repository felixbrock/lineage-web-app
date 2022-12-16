import { useRef, useEffect, ReactElement, CSSProperties } from 'react';
import {
  init,
  getInstanceByDom,
  YAXisComponentOption,
  EChartsOption,
  SetOptionOpts,
  ECharts,
} from 'echarts';
import LoadingScreen from './loading-screen';

interface HistoryDataSet {
  isAnomaly: boolean;
  userFeedbackIsAnomaly: number;
  timestamp: string;
  valueLowerBound: number;
  valueUpperBound: number;
  value: number;
}

export interface TestHistoryEntry {
  testType: string;
  testSuiteId: string;
  historyDataSet: HistoryDataSet[];
}

const getTimestamp = (dayOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString();
};

const defaultNullnessValues = [531, 601, 598, 1561, 576, 599, 564, 602, 595];
export const defaultNullnessData: HistoryDataSet[] = defaultNullnessValues.map(
  (el, i) => ({
    value: el,
    isAnomaly: i === 3,
    timestamp: getTimestamp(i + 1 - defaultNullnessValues.length),
    userFeedbackIsAnomaly: -1,
    valueLowerBound:
      (defaultNullnessValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      1.3,
    valueUpperBound:
      (defaultNullnessValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) * .7
  })
);

const effectiveRateNullValues = [431, 501, 498, 516, 593, 524, 2561, 632, 545];
export const effectiveRateNullData: HistoryDataSet[] =
  effectiveRateNullValues.map((el, i) => ({
    value: el,
    isAnomaly: i === 6,
    timestamp: getTimestamp(i + 1 - effectiveRateNullValues.length),
    userFeedbackIsAnomaly: -1,
    valueLowerBound:
      (effectiveRateNullValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      1.3,
    valueUpperBound:
      (effectiveRateNullValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      .7,
  }));

const defaultFreshnessValues = [132, 131, 130, 132, 540, 129, 127, 120, 128];
export const defaultFreshnessData: HistoryDataSet[] =
  defaultFreshnessValues.map((el, i) => ({
    value: el,
    isAnomaly: i === 4,
    timestamp: getTimestamp(i + 1 - defaultFreshnessValues.length),
    userFeedbackIsAnomaly: -1,
    valueLowerBound:
      (defaultFreshnessValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      1.3,
    valueUpperBound:
      (defaultFreshnessValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      .7,
  }));

const effectiveRateFreshSampleValues = [32, 31, 29, 30, 30, 30, 92, 31, 30];
export const effectiveRateFreshSampleData: HistoryDataSet[] =
  effectiveRateFreshSampleValues.map((el, i) => ({
    value: el,
    isAnomaly: i === 6,
    timestamp: getTimestamp(i + 1 - effectiveRateFreshSampleValues.length),
    userFeedbackIsAnomaly: -1,
    valueLowerBound:
      (effectiveRateFreshSampleValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      1.3,
    valueUpperBound:
      (effectiveRateFreshSampleValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      .7,
  }));

const defaultDistValues = [
  10560, 12351, 8680, 5874, 11502, 9534, 11361, 10689, 47011
];
export const defaultDistData: HistoryDataSet[] =
  defaultDistValues.map((el, i) => ({
    value: el,
    isAnomaly: i === 8 || i === 3,
    timestamp: getTimestamp(i + 1 - defaultDistValues.length),
    userFeedbackIsAnomaly: -1,
    valueLowerBound:
      (defaultDistValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      1.3,
    valueUpperBound:
      (defaultDistValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      .7,
  }));


const effectiveRateDistValues = [4, 4.5, 4.7, 4.8, 3.8, 3.8, 3.8, 5.2, 20.6];
export const effectiveRateDistData: HistoryDataSet[] =
  effectiveRateDistValues.map((el, i) => ({
    value: el,
    isAnomaly: i === 8,
    timestamp: getTimestamp(i + 1 - effectiveRateDistValues.length),
    userFeedbackIsAnomaly: -1,
    valueLowerBound:
      (effectiveRateDistValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      1.3,
    valueUpperBound:
      (effectiveRateDistValues
        .slice(0, i + 1)
        .reduce((partialSum, a) => partialSum + a, 0) /
        (i + 1)) *
      .7,
  }));

export const defaultYAxis: YAXisComponentOption = {
  type: 'value',
  boundaryGap: [0, '30%'],
};

export const defaultYAxisTime: YAXisComponentOption = {
  ...defaultYAxis,
  axisLabel: {
    formatter: '{value} min',
  },
};

// interface MarkAreaBoundary {
//   name?: string;
//   xAxis: number;
// }

interface VisualPiece {
  gte: number;
  lte: number;
  color: string;
  colorAlpha: number;
}

const isVisualPiece = (obj: unknown): obj is VisualPiece =>
  !!obj && typeof obj === 'object' && 'color' in obj;
// const isMarkArea = (obj: unknown): obj is MarkAreaBoundary[] =>
//   !!obj &&
//   typeof obj === 'object' &&
//   obj.constructor.name === 'Array' &&
//   (obj as unknown[]).every(
//     (el) => !!el && typeof el === 'object' && 'xAxis' in obj
//   );

export const defaultOption = (
  yAxis: YAXisComponentOption,
  data: HistoryDataSet[]
): EChartsOption => {
  const hasAnomolies = data.some(
    (el) =>
      el.isAnomaly &&
      (el.userFeedbackIsAnomaly === -1 || el.userFeedbackIsAnomaly === 1)
  );

  const { xAxis, values, upperBounds, lowerBounds } = data.reduce(
    (
      accumulation: {
        xAxis: string[];
        values: number[];
        upperBounds: number[];
        lowerBounds: number[];
      },
      el: HistoryDataSet
    ) => {
      const localAcc = accumulation;

      localAcc.xAxis.push(el.timestamp);
      localAcc.values.push(el.value);
      localAcc.upperBounds.push(el.valueUpperBound);
      localAcc.lowerBounds.push(el.valueLowerBound);

      return localAcc;
    },
    { xAxis: [], values: [], upperBounds: [], lowerBounds: [] }
  );

  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis,
    },
    yAxis,
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    visualMap: hasAnomolies
      ? {
          show: false,
          dimension: 0,
          pieces: data
            .map((el, index) =>
              el.isAnomaly &&
              (el.userFeedbackIsAnomaly === 1 ||
                el.userFeedbackIsAnomaly === -1)
                ? {
                    gte: index === 0 ? index : index - 1,
                    lte: index + 1,
                    color: 'red',
                    colorAlpha: 0.2,
                  }
                : undefined
            )
            .filter(isVisualPiece),
        }
      : undefined,
    series: [
      {
        name: 'Lower Threshold',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          type: 'dotted',
          color: 'grey',
          // width: 2
        },
        itemStyle: {
          color: 'grey',
        },
        data: lowerBounds,
      },
      {
        name: 'Upper Threshold',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          type: 'dashed',
          color: 'grey',
          // width: 2
        },
        itemStyle: {
          color: 'grey',
        },
        data: upperBounds,
      },
      {
        name: 'Measurements',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#6f47ef',
          // width: 2
        },
        itemStyle: {
          color: '#6f47ef',
        },
        areaStyle: hasAnomolies ? {} : undefined,
        data: values,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };
};

export interface ReactEChartsProps {
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: 'light' | 'dark';
}

export default ({
  option,
  style,
  settings,
  loading,
  theme,
}: ReactEChartsProps): ReactElement => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (!chart) throw new ReferenceError('chart obj does not exist');
      chart.setOption(option, settings);
    }
  }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      if (!chart) throw new ReferenceError('chart obj does not exist');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart.showLoading() : chart.hideLoading();
    }
  }, [loading, theme]);

  return chartRef ? (
    <div ref={chartRef} style={{ width: '100%', height: '400px', ...style }} />
  ) : (
    <div style={{ width: '100%', height: '400px', ...style }}>
      <LoadingScreen tailwindCss="flex w-full items-center justify-center" />
    </div>
  );
};
