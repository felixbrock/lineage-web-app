import { useRef, useEffect, ReactElement } from 'react';
import { init, getInstanceByDom } from 'echarts';
import type { CSSProperties } from 'react';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

export const DistributionDefaultOption : EChartsOption =  {   
  xAxis: {
    type: 'category',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '30%']
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces:
     [
      {
        gt: 7,
        lt: 8,
        color: '#db1d33',
        colorAlpha: .2,
      },

    ]
  },
  series: [
    {
      type: 'line',
      lineStyle: {
        color: '#6f47ef',
        // width: 2
      },
      areaStyle: {},
      data: [        ['2022-06-01', 47011],
      ['2022-05-31', 10560],
      ['2022-05-30', 12351],
      ['2022-05-29', 8680],
      ['2022-05-28', 6874],
      ['2022-05-27', 11502],
      ['2022-05-26', 9534],
      ['2022-05-25', 11361],
      ['2022-05-24', 10689]].reverse(),
    }
  ],
  tooltip: {
    trigger: 'axis',
  },
};

export const FreshnessDefaultOption : EChartsOption =  {   
  xAxis: {
    type: 'category',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} min'
    },
    boundaryGap: [0, '30%']
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces:
     [
      {
        gt: 3,
        lt: 5,
        color: '#db1d33',
        colorAlpha: .2,
      },

    ]
  },
  series: [
    {
      type: 'line',
      lineStyle: {
        color: '#6f47ef',
        // width: 2
      },
      areaStyle: {},
      data: [['2022-06-01 1pm', 132],
      ['2022-06-01 11am', 131],
      ['2022-06-01 09am', 130],
      ['2022-06-01 07am', 132],
      ['2022-06-01 05am', 540],
      ['2022-06-01 04am', 129],
      ['2022-06-01 03am', 127],
      ['2022-06-01 02am', 120],
      ['2022-06-01 12am', 128]].reverse(),
    }
  ],
  tooltip: {
    trigger: 'axis',
  },
};

export const NullnessDefaultOption : EChartsOption =  {   
  xAxis: {
    type: 'category',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '30%']
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces:
     [
      {
        gt: 4,
        lt: 6,
        color: '#db1d33',
        colorAlpha: .2,
      },

    ]
  },
  series: [
    {
      type: 'line',
      lineStyle: {
        color: '#6f47ef',
        // width: 2
      },
      areaStyle: {},
      data: [        ['2022-06-01', 531],
      ['2022-05-31', 601],
      ['2022-05-30', 598],
      ['2022-05-29', 1561],
      ['2022-05-28', 576],
      ['2022-05-27', 599],
      ['2022-05-26', 564],
      ['2022-05-25', 602],
      ['2022-05-24', 595]].reverse(),
    }
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
