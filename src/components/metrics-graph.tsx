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

export const defaultDistributionData = [
  47011, 10560, 12351, 8680, 6874, 11502, 9534, 11361, 10689,
];

export const effectiveRateSampleDistributionData = [
  4, 4.5, 4.7, 4.8, 3.8, 3.8, 3.8, 5.2, 20.6,
].reverse();

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
  data: {
    isAnomaly: boolean;
    userFeedbackIsAnomaly: number;
    dataSet: [string, number];
  }[]
): EChartsOption => {
  const hasAnomolies = data.some(
    (el) =>
      el.isAnomaly &&
      (el.userFeedbackIsAnomaly === -1 || el.userFeedbackIsAnomaly === 1)
  );

  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis,
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
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#6f47ef',
          // width: 2
        },
        areaStyle: hasAnomolies ? {} : undefined,
        data: data.map((el) => el.dataSet),
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
