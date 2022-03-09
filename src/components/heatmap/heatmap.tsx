import { ApexOptions } from 'apexcharts';
import React, { ReactElement } from 'react';
import Chart from 'react-apexcharts';

export interface HeatmapSeries {
  name: string;
  data: SeriesData[];
}

interface HeatmapMetaData {
  startDate: Date;
}

export interface HeatmapData {
  series: HeatmapSeries[];
  metaData: HeatmapMetaData;
}

export interface SeriesData {
  x: string;
  y: number;
}

const dayIndex: { [key: number]: string } = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

const monthIndex: { [key: number]: string } = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

const generateHeatmapIndex = (
  todayIndex: number
): { [key: string]: number } => {
  const dayIndices = [0, 1, 2, 3, 4, 5, 6];
  const orderedDays = dayIndices
    .slice(todayIndex + 1)
    .concat(dayIndices.slice(0, todayIndex + 1));

  const heatmapIndexRegistry: { [key: string]: number } = {};

  let heatmapIndex = 0;
  orderedDays.forEach((index) => {
    heatmapIndexRegistry[dayIndex[index]] = heatmapIndex;
    heatmapIndex += 1;
  });

  return heatmapIndexRegistry;
};

export interface DateData {
  [key: string]: number;
}

export const buildDateKey = (date: Date): string => {
  const dateYear = date.getUTCFullYear();
  const dateMonth =
    date.getUTCMonth() < 9
      ? `0${(date.getUTCMonth() + 1).toString()}`
      : (date.getUTCMonth() + 1).toString();
  const dateDate =
    date.getUTCDate() < 10
      ? `0${date.getUTCDate().toString()}`
      : date.getUTCDate().toString();

  return `${dateYear}-${dateMonth}-${dateDate}`;
};

export const generateDateDataStub = (
  startDate: Date,
  endDate: Date
): DateData => {
  const dates: DateData = {};
  const date = new Date(startDate);
  while (date.getTime() <= endDate.getTime()) {
    const dateKey = buildDateKey(date);
    dates[dateKey] = 0;
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return dates;
};

interface DataPointInfo {
  y: number;
  date: Date;
}

interface DayRegistry {
  [key: string]: DataPointInfo[];
}

const orderByDay = (dateRegistry: DateData): DayRegistry => {
  const dayRegistry: DayRegistry = {
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  };

  Object.keys(dateRegistry).forEach((key) => {
    const y = dateRegistry[key];
    const date = new Date(Date.parse(key));

    const day: string = dayIndex[date.getUTCDay()];

    dayRegistry[day].push({ y, date });
  });

  return dayRegistry;
};

const buildSeries = (
  dayRegistry: DayRegistry,
  todayIndex: number
): HeatmapSeries[] => {
  const heatmapData: HeatmapSeries[] = [
    { name: '', data: [] },
    { name: '', data: [] },
    { name: '', data: [] },
    { name: '', data: [] },
    { name: '', data: [] },
    { name: '', data: [] },
    { name: '', data: [] },
  ];

  const heatmapIndex = generateHeatmapIndex(todayIndex);

  Object.keys(heatmapIndex).forEach((day) => {
    const index = heatmapIndex[day];
    heatmapData[index].name = index % 2 ? day : '';
  });

  Object.keys(dayRegistry).forEach((key) => {
    const day = dayRegistry[key];
    day.sort((date1, date2) => {
      if (date1.date < date2.date) return -1;
      if (date1.date > date2.date) return 1;
      return 0;
    });

    let month: number;

    day.forEach((data) => {
      const dataMonth = data.date.getUTCMonth();
      let x = '';

      if (!month || month !== dataMonth) {
        month = dataMonth;
        x = monthIndex[month];
      } else x = '';

      heatmapData[heatmapIndex[key]].data.push({ x, y: data.y });
    });
  });

  return heatmapData.reverse();
};

export const buildHeatmapData = (
  startDate: Date,
  endDate: Date,
  dateRegistry: DateData
): HeatmapData => {
  const dayRegistry = orderByDay(dateRegistry);

  return {
    metaData: { startDate },
    series: buildSeries(dayRegistry, endDate.getUTCDay()),
  };
};

const type = 'heatmap';

const buildOptions = (
  metaData: HeatmapMetaData,
  seriesCount: number
): ApexOptions => ({
  colors: ['#2c25ff'],
  chart: {
    background: '#333333',
    animations: { speed: 75 },
    toolbar: {
      show: false,
    },
  },
  theme: { mode: 'dark' },
  grid: { show: false },
  stroke: {
    colors: ['#333333'],
    curve: 'smooth',
    lineCap: 'round',
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    x: {
      formatter: (value, { seriesIndex, dataPointIndex }) => {
        const date = new Date(metaData.startDate);
        date.setUTCDate(
          date.getUTCDate() + seriesCount - 1 - seriesIndex + 7 * dataPointIndex
        );

        const month =
          date.getUTCMonth() < 9
            ? `0${date.getUTCMonth() + 1}`
            : date.getUTCMonth() + 1;
        
        const dateDate = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();

        return `${date.getUTCFullYear()}-${month}-${dateDate}`;
      },
    },
    y: {
      title: {
        formatter: () => '',
      },
    },
  },
  xaxis: {
    labels: {
      style: {
        fontSize: '12px',
        colors: [
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
        ],
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
        colors: [
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
          '#7f7f7f',
        ],
      },
    },
  },
});

export const Heatmap = (data: HeatmapData): ReactElement => {
  const { series, metaData } = data;
  const options = buildOptions(metaData, series.length);
  return <Chart options={options} series={series} type={type} />;
};
