import { useRef, useEffect, ReactElement } from 'react';
import { init, getInstanceByDom } from 'echarts';
import type { CSSProperties } from 'react';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

const distributionDefaultData = [
  47011, 10560, 12351, 8680, 6874, 11502, 9534, 11361, 10689,
];

export const DistributionDefaultOption: EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '30%'],
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [
      {
        gt: 7,
        lt: 8,
        color: '#db1d33',
        colorAlpha: 0.2,
      },
    ],
  },
  series: [
    {
      type: 'line',
      lineStyle: {
        color: '#6f47ef',
        // width: 2
      },
      areaStyle: {},
      data: distributionDefaultData
        .map((element, index) => {
          const date = new Date();
          date.setDate(date.getDate() - index);
          return [date.toISOString().split('T')[0], element];
        })
        .reverse(),
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
};

const freshnessDefaultData = [132, 131, 130, 132, 540, 129, 127, 120, 128];

export const FreshnessDefaultOption: EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} min',
    },
    boundaryGap: [0, '30%'],
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [
      {
        gt: 3,
        lt: 5,
        color: '#db1d33',
        colorAlpha: 0.2,
      },
    ],
  },
  series: [
    {
      type: 'line',
      lineStyle: {
        color: '#6f47ef',
        // width: 2
      },
      areaStyle: {},
      data: freshnessDefaultData
      .map((element, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return [date.toISOString().split('T')[0], element];
      })
      .reverse(),
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
};

const nullnessDefaultData =  [
  531,
  601,
  598,
  1561,
  576,
  599,
  564,
  602,
  595,
];

export const NullnessDefaultOption: EChartsOption = {
  xAxis: {
    type: 'category',
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '30%'],
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [
      {
        gt: 4,
        lt: 6,
        color: '#db1d33',
        colorAlpha: 0.2,
      },
    ],
  },
  series: [
    {
      type: 'line',
      lineStyle: {
        color: '#6f47ef',
        // width: 2
      },
      areaStyle: {},
      data: nullnessDefaultData
      .map((element, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return [date.toISOString().split('T')[0], element];
      })
      .reverse(),
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
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

  return (
    <div ref={chartRef} style={{ width: '100%', height: '400px', ...style }} />
  );
};
