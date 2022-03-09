import React, { ReactElement, useState, useRef, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { Input, FieldLabel } from '../../components/form/form-items';
import { HistoricalData } from './historical-data-items';
import Modal from '../../components/modal/modal';
import Table from '../../components/table/table';
import Button from '../../components/button/button';
import SelectorApiRepository from '../../infrastructure/selector-api/selector-api-repository';
import SelectorDto from '../../infrastructure/selector-api/selector-dto';
import SystemApiRepository from '../../infrastructure/system-api/system-api-repository';

export const buildQueryTimestamp = (date: Date): string => {
  const dateYear = date.getUTCFullYear();
  const dateMonth =
    date.getUTCMonth() < 9
      ? `0${(date.getUTCMonth() + 1).toString()}`
      : (date.getUTCMonth() + 1).toString();
  const dateDate =
    date.getUTCDate() < 10
      ? `0${date.getUTCDate().toString()}`
      : date.getUTCDate().toString();
  const dateHour =
    date.getUTCHours() < 10
      ? `0${date.getUTCHours().toString()}`
      : date.getUTCHours().toString();
  const dateMinutes =
    date.getUTCMinutes() < 10
      ? `0${date.getUTCMinutes().toString()}`
      : date.getUTCMinutes().toString();
  const dateSeconds =
    date.getUTCSeconds() < 10
      ? `0${date.getUTCSeconds().toString()}`
      : date.getUTCSeconds().toString();

  return `${dateYear}${dateMonth}${dateDate}T${dateHour}${dateMinutes}${dateSeconds}Z`;
};

const getDateSelectors = async (
  startDate: Date,
  endDate: Date,
  jwt: string
): Promise<SelectorDto[]> => {
  const alertCreatedOnStart = buildQueryTimestamp(startDate);
  const alertCreatedOnEnd = buildQueryTimestamp(endDate);

  try {
    return await SelectorApiRepository.getBy(
      new URLSearchParams({ alertCreatedOnStart, alertCreatedOnEnd }),
      jwt
    );
  } catch (error: any) {
    return Promise.reject(new Error(error.message));
  }
};

// 'Date', 'Time', 'Type', 'System', 'System-Id', 'Selector-Content', 'Selector-Id', 'Automation-Name', 'Automation-Id'
// interface HistoricDataSet {
//   date: string;
//   time: string;
//   type: string;
//   system: string;
//   systemId: string;
//   selectorContent: string;
//   selectorId: string;
//   automationName: string;
//   automationId: string;
// }

const getHistoricalData = async (
  date: Date,
  jwt: string
): Promise<string[][]> => {
  const startDate = new Date(date);

  startDate.setUTCHours(0);
  startDate.setUTCMinutes(0);
  startDate.setUTCSeconds(0);
  startDate.setUTCMilliseconds(0);

  const endDate = new Date(date);
  endDate.setUTCHours(23);
  endDate.setUTCMinutes(59);
  endDate.setUTCSeconds(59);
  endDate.setUTCMilliseconds(999);

  try {
    const selectors = await getDateSelectors(startDate, endDate, jwt);

    const datasets = await Promise.all(
      selectors.map(async (selector) => {
        const system = await SystemApiRepository.getOne(selector.systemId, jwt);

        if (!system)
          throw new Error(
            `Historical data cannot be produced: System for selector ${selector.id} not found`
          );

        const relevantAlerts = selector.alerts.filter(
          (alert) =>
            alert.createdOn >= startDate.getTime() &&
            alert.createdOn <= endDate.getTime()
        );

        return relevantAlerts.map((alert) => {
          const createdOnDate = new Date(alert.createdOn);
          const hours = createdOnDate.getHours();
          const minutes = createdOnDate.getMinutes();
          const seconds = createdOnDate.getSeconds();
          const time = `${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}`;

          return [
            createdOnDate.toISOString().substr(0, 10),
            time,
            'Alert',
            system.name,
            system.id,
            selector.content,
            selector.id,
          ];
        });
      })
    );

    return datasets.flatMap((selectorset) => selectorset);
  } catch (error: any) {
    return Promise.reject(new Error(error.message));
  }
};

export default (): ReactElement => {
  const initialRenderFinished = useRef(false);

  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));

  const [table, setTable] = useState<ReactElement>();

  const [dataAvailable, setDataAvailable] = useState(false);

  const [search, setSearch] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleErrorState = (): void => setShowErrorModal(!showErrorModal);

  const [systemError, setSystemError] = useState('');

  const [user, setUser] = useState();

  const renderHistoricalData = () => {
    setUser(undefined);

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);

        Auth.federatedSignIn();
      });
  };

  useEffect(() => {
    if (!user) return;

    Auth.currentSession()
      .then((session) => {
        const accessToken = session.getAccessToken();

        const jwt = accessToken.getJwtToken();

        return getHistoricalData(new Date(date), jwt);
      })
      .then((datasets) => {
        setDataAvailable(!!datasets.length);
        const headers = datasets.length
          ? [
              'Date',
              'Time',
              'Type',
              'System-Name',
              'System-Id',
              'Selector-Content',
              'Selector-Id',
            ]
          : [];
        setTable(Table(headers, datasets));
        if (!initialRenderFinished.current)
          initialRenderFinished.current = true;
      })
      .catch((error) => {
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [user]);

  useEffect(renderHistoricalData, []);

  useEffect(() => {
    if (!search || !initialRenderFinished.current) return;
    renderHistoricalData();
    setSearch(false);
  }, [search]);

  return (
    <HistoricalData>
      <FieldLabel>Choose Day to Query</FieldLabel>
      <Input
        type="Date"
        defaultValue={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <Button onClick={() => setSearch(true)}>Search</Button>
      {search ? (
        <FieldLabel>Searching...</FieldLabel>
      ) : (
        <FieldLabel>
          {dataAvailable ? 'Alerts of Chosen Day' : 'No Data to Show'}
        </FieldLabel>
      )}
      {table}
      {showErrorModal && systemError
        ? Modal(
            <p>{systemError}</p>,
            'An error occurred',
            'Ok',
            handleErrorState,
            handleErrorState
          )
        : null}
    </HistoricalData>
  );
};
