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

export const defaultDistributionData = [
  47011, 10560, 12351, 8680, 6874, 11502, 9534, 11361, 10689,
];

export const effectiveRateSampleDistributionData = [
  4, 4.5, 4.7, 4.8, 3.8, 3.8, 3.8, 5.2, 20.6,
].reverse();

export const defaultYAxis: YAXisComponentOption = {
  type: 'value',
  boundaryGap: [0, '30%'],
  min: 'dataMin',
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
      min: 'dataMin',
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

export const defaultFreshnessData = [
  132, 131, 130, 132, 540, 129, 127, 120, 128,
];

export const effectiveRateSampleFreshnessData = [
  32, 31, 29, 30, 30, 30, 92, 31, 30,
].reverse();

export const defaultNullnessData = [
  531, 601, 598, 1561, 576, 599, 564, 602, 595,
];

export const effectiveRateSampleNullnessData = [
  431, 501, 498, 516, 593, 524, 2561, 632, 545,
];

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
