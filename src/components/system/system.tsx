import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import {
  System,
  Header,
  MissedAlertBubble,
  Title,
  OptionsIcon,
  IdInfo,
  Text,
  // CopyIdIcon,
  // AlertMap,
  // Subtitle,
  Footer,
  StatsIcon,
} from './system-items';
// import { Heatmap } from '../heatmap/heatmap';
import Button from '../button/button';
import Label from '../label/label';

export default (
  id: string,
  title: string,
  missedAlerts: number,
  setSystemId: (systemId: string) => void,
  setSubscribersState: (state: boolean) => void,
  setOptionsState: (state: boolean) => void,
  setAlertsOverviewState: (state: boolean) => void
): ReactElement => {
  const history = useHistory();

  const handleDetailClick = () => history.push(`/system/${id}`);

  const handleSubscribersClick = () => {
    setSystemId(id);
    setSubscribersState(true);
  };
  const handleOptionsClick = () => {
    setSystemId(id);
    setOptionsState(true);
  };
  const handleAlertsOverviewClick = () => {
    setSystemId(id);
    setAlertsOverviewState(true);
  };
  return (
    <System>
      <Header>
        {missedAlerts ? (
          <MissedAlertBubble>{missedAlerts}</MissedAlertBubble>
        ) : (
          <div />
        )}
        <Button onClick={handleDetailClick}>
          <Title>{title}</Title>
        </Button>
        <Button onClick={handleOptionsClick}>
          <OptionsIcon />
        </Button>
      </Header>
      <IdInfo>
        <Text>{id}</Text>
        {/* <Button onClick={test}>
          <CopyIdIcon />
        </Button> */}
      </IdInfo>
      {/* <Subtitle>Number of Alerts per Day</Subtitle> */}
      {/* <AlertMap>
        {heatmapData && heatmapData.series.length ? (
          Heatmap(heatmapData)
        ) : (
          <Text>No Data to Show</Text>
        )}
      </AlertMap> */}
      <Footer>
        <Label onClick={handleSubscribersClick}>Subscribed Automations</Label>
        <Button onClick={handleAlertsOverviewClick}>
          <StatsIcon />
        </Button>
      </Footer>
    </System>
  );
};
