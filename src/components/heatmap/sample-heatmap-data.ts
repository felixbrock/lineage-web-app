import { HeatmapData } from "./heatmap";

export default (): HeatmapData => {
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - 7 * 20);

  startDate.setUTCHours(0);
  startDate.setUTCMinutes(0);
  startDate.setUTCSeconds(0);
  startDate.setUTCMilliseconds(0);

  return {
    metaData: { startDate },
    series: [
      {
        name: '',
        data: [
          {
            x: 'Jan',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 3,
          },
          {
            x: 'Feb',
            y: 3,
          },
          {
            x: '',
            y: 6,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'Mar',
            y: 4,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 8,
          },
          {
            x: 'Apr',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'May',
            y: 7,
          },
          {
            x: '',
            y: 6,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 0,
          },
        ],
      },
      {
        name: 'Fri',
        data: [
          {
            x: 'Jan',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 3,
          },
          {
            x: 'Feb',
            y: 1,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Mar',
            y: 5,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Apr',
            y: 6,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 4,
          },
          {
            x: 'May',
            y: 7,
          },
          {
            x: '',
            y: 5,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
        ],
      },
      {
        name: '',
        data: [
          {
            x: 'Jan',
            y: 3,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'Feb',
            y: 4,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'Mar',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 6,
          },
          {
            x: '',
            y: 3,
          },
          {
            x: 'Apr',
            y: 2,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 5,
          },
          {
            x: 'May',
            y: 3,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 3,
          },
        ],
      },
      {
        name: 'Wed',
        data: [
          {
            x: 'Jan',
            y: 3,
          },
          {
            x: '',
            y: 5,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'Feb',
            y: 2,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 4,
          },
          {
            x: 'Mar',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Apr',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 8,
          },
          {
            x: 'May',
            y: 2,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 3,
          },
        ],
      },
      {
        name: '',
        data: [
          {
            x: 'Jan',
            y: 1,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 3,
          },
          {
            x: 'Feb',
            y: 8,
          },
          {
            x: '',
            y: 4,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'Mar',
            y: 4,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: 'Apr',
            y: 4,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'May',
            y: 5,
          },
          {
            x: '',
            y: 4,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
        ],
      },
      {
        name: 'Mon',
        data: [
          {
            x: 'Jan',
            y: 8,
          },
          {
            x: '',
            y: 6,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Feb',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: 'Mar',
            y: 1,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Apr',
            y: 3,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 2,
          },
          {
            x: 'May',
            y: 3,
          },
          {
            x: '',
            y: 3,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
        ],
      },
      {
        name: '',
        data: [
          {
            x: 'Jan',
            y: 6,
          },
          {
            x: '',
            y: 4,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Feb',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: 'Mar',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 3,
          },
          {
            x: 'Apr',
            y: 2,
          },
          {
            x: '',
            y: 1,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 5,
          },
          {
            x: 'May',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
          {
            x: '',
            y: 0,
          },
        ],
      },
    ],
  };
};
