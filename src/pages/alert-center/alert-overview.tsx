import { Avatar, AvatarGroup, createTheme, ThemeProvider } from '@mui/material';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import { ReactElement } from 'react';
import baseAlertSummaries from './alerts';
import dependencies from './dependencies';
import people from './people';
import avatarUrls from './avatar-urls';
import Navbar from '../../components/navbar';

type DependencyType = 'up' | 'down';

export interface OverviewAlertSummary {
  relationName: string;
  matName: string;
  colName?: string;
  type: string;
  occurredAt: string;
  severity: number;
  dependencies: {
    relationName: string;
    matName: string;
    colName?: string;
    type: DependencyType;
  }[];
  people: {
    imageUrl: string;
    name: string;
    dependentOn: {
      relationName: string;
      matName: string;
      colName?: string;
    }[];
  }[];
}

export const alertSummaries = baseAlertSummaries.map(
  (alert: any): OverviewAlertSummary => ({
    ...alert,
    dependencies: Array(Math.floor(Math.random() * 50))
      .fill(0)
      .map(
        () =>
          dependencies[Math.floor(Math.random() * (dependencies.length - 1))]
      ),
    people: Array(Math.floor(Math.random() * 10))
      .fill(0)
      .map(() => ({
        ...people[Math.floor(Math.random() * (people.length - 1))],
        dependentOn: Array(Math.floor(Math.random() * 50))
          .fill(0)
          .map(
            () =>
              dependencies[
                Math.floor(Math.random() * (dependencies.length - 1))
              ]
          ),
      })),
  })
);

const groupByDay = (
  alerts: OverviewAlertSummary[]
): { [date: string]: OverviewAlertSummary[] } =>
  alerts.reduce<{ [date: string]: OverviewAlertSummary[] }>((acc, alert) => {
    const localAcc = acc;

    const date = alert.occurredAt.split('T')[0];
    if (localAcc[date]) localAcc[date].push(alert);
    else localAcc[date] = [alert];

    return localAcc;
  }, {});

const groupByRelationName = (
  alerts: OverviewAlertSummary[]
): { [relationName: string]: OverviewAlertSummary[] } =>
  alerts.reduce<{ [relationName: string]: OverviewAlertSummary[] }>(
    (acc, alert) => {
      const localAcc = acc;

      const relationName = alert.relationName;
      if (localAcc[relationName]) localAcc[relationName].push(alert);
      else localAcc[relationName] = [alert];

      return localAcc;
    },
    {}
  );

const generateAlertRow = (alert: OverviewAlertSummary): ReactElement => {
  const twCss = 'whitespace-nowrap py-2 px-4';
  return (
    <tr className="rounded-xl ">
      <td className={twCss}>{alert.matName}</td>
      <td className={twCss}>{alert.colName}</td>
      <td className={twCss}>{alert.type}</td>
      <td className={twCss}>
        <AvatarGroup max={4}>
          {Array(Math.floor(Math.random() * 10 || 7))
            .fill(0)
            .map(() => (
              <Avatar
                alt="Remy Sharp"
                src={
                  avatarUrls[
                    Math.floor(Math.random() * (avatarUrls.length - 1))
                  ]
                }
                sx={{ bgcolor: 'white' }}
                imgProps={{ style: { border: 1 } }}
              />
            ))}
        </AvatarGroup>
      </td>
      <td className={twCss}>
        <button className="rounded-full border-2 border-violet-600 py-1 px-2 font-bold ">
          Details
        </button>
      </td>
    </tr>
  );
};

const generateTable = (alerts: OverviewAlertSummary[]): ReactElement => {
  const twCss =
    'py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap   ';

  return (
    <table className="  divide-y divide-gray-200 rounded-xl bg-gradient-to-r from-white via-violet-200 to-white">
      <thead>
        <tr>
          <th className={twCss}>Table Name</th>
          <th className={twCss}>Column Name</th>
          <th className={twCss}>Type</th>
          <th className={twCss}>People Impacted</th>
          <th className={twCss}></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {alerts.map((alert) => generateAlertRow(alert))}
      </tbody>
    </table>
  );
};

const generatePerRelationNameOverview = (
  relationName: string,
  alerts: OverviewAlertSummary[]
): ReactElement => (
  <>
    <div className="mt-10 mb-2 flex flex-wrap items-center">
      <CircleTwoToneIcon className="mr-2 w-1/12  " />

      <h3 className=" w-11/12 whitespace-nowrap text-xl font-bold  text-gray-400  ">
        {relationName}
      </h3>
    </div>
    {generateTable(alerts)}
  </>
);

const generatePerDayOverview = (
  day: string,
  alerts: OverviewAlertSummary[]
): ReactElement => (
  <div className=" mb-8 flex w-full items-start justify-between pl-1">
    <div className="z-20 m-2 flex min-w-fit items-center rounded-full bg-violet-800 shadow-xl">
      <h1 className="auto p-2 text-lg font-semibold text-white">{day}</h1>
    </div>
    <div className="order-1 w-full p-2 py-12">
      {Object.entries(groupByRelationName(alerts)).map((el) =>
        generatePerRelationNameOverview(el[0], el[1])
      )}
    </div>
  </div>
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#a487ff',
    },
    secondary: {
      main: '#000000',
    },
    success: {
      main: '#6f47ef',
    },
    info: {
      main: '#c8c8c8',
    },
  },
});

export const Overview = ({
  alerts,
}: {
  alerts: OverviewAlertSummary[];
}): ReactElement => (
  <ThemeProvider theme={theme}>
    <div id="lineageContainer">
      <Navbar current="alert-center" jwt={''} />
      <div className="h-screen overflow-y-auto bg-gradient-to-r from-white via-violet-200 to-white">
        <div className="relative max-w-2xl">
          <div className="pl-10">
            <div className="absolute top-0 bottom-0 z-0 h-full w-0 border-2 border-gray-400"></div>
            {Object.entries(groupByDay(alerts))
              .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
              .map((el) => generatePerDayOverview(el[0], el[1]))}
          </div>
        </div>
      </div>
    </div>
  </ThemeProvider>
);
