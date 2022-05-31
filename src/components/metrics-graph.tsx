import { useRef, useEffect, ReactElement } from 'react';
import { init, getInstanceByDom } from 'echarts';
import type { CSSProperties } from 'react';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

export const OutlierDefaultOption : EChartsOption =  {   
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
        gt: 1,
        lt: 3,
        color: '#db1d33',
        colorAlpha: .2,
      },

    ]
  },
  series: [
    {
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#2b24ff',
        // width: 2
      },
      areaStyle: {},
      data: [        ['2022-06-10', 200],
      ['2022-06-11', 560],
      ['2022-06-12', 750],
      ['2022-06-13', 580],
      ['2022-06-14', 250],
      ['2022-06-15', 300],
      ['2022-06-16', 450],
      ['2022-06-17', 300],
      ['2022-06-18', 100]],
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
    boundaryGap: [0, '30%']
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces:
     [
      {
        gt: 1,
        lt: 3,
        color: '#db1d33',
        colorAlpha: .2,
      },

    ]
  },
  series: [
    {
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#2b24ff',
        // width: 2
      },
      areaStyle: {},
      data: [        ['2022-06-10', 1023],
      ['2022-06-11', 830],
      ['2022-06-12', 765],
      ['2022-06-13', 200],
      ['2022-06-14', 902],
      ['2022-06-15', 1202],
      ['2022-06-16', 1002],
      ['2022-06-17', 1005],
      ['2022-06-18', 1015]],
    }
  ],
  tooltip: {
    trigger: 'axis',
  },
};

export const PopulationDefaultOption : EChartsOption =  {   
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
        gt: 1,
        lt: 3,
        color: '#db1d33',
        colorAlpha: .2,
      },

    ]
  },
  series: [
    {
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#2b24ff',
        // width: 2
      },
      areaStyle: {},
      data: [['2022-06-10', 12],
      ['2022-06-11', 15],
      ['2022-06-12', 54],
      ['2022-06-13', 301],
      ['2022-06-14', 42],
      ['2022-06-15', 9],
      ['2022-06-16', 32],
      ['2022-06-17', 31],
      ['2022-06-18', 22]],
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
