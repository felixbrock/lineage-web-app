import React, { ReactElement } from 'react';
import {
  Automation,
  Header,
  MissedAlertBubble,
  // MissedWarningBubble,
  Title,
  OptionsIcon,
  IdInfo,
  Text,
  // CopyIdIcon,
  Footer,
  StatsIcon,
} from './automation-items';
import Button from '../button/button';
import Label from '../label/label';

export default (
  id: string,
  name: string,
  missedAlerts: number,
  setAutomationId: (automationId: string) => void,
  setSubscriptionsState: (state: boolean) => void,
  setAlertsClick: (state: boolean) => void,
  setOptionsState: (state: boolean) => void,
  setAlertsOverviewState: (state: boolean) => void
): ReactElement => {
  const handleSubscriptionsState = () => {
    setAutomationId(id);
    setSubscriptionsState(true);
  };
  const handleOptionsClick = () => {
    setAutomationId(id);
    setOptionsState(true);
  };
  const handleAlertsOverviewClick = () => {
    setAutomationId(id);
    setAlertsOverviewState(true);
  };
  const handleAlertsClick = () => {   
    setAutomationId(id);
    setAlertsClick(true);
  };
  
  return (
    <Automation>
      <Header>
        {missedAlerts ? (
          <MissedAlertBubble onClick={handleAlertsClick}>
            {missedAlerts}
          </MissedAlertBubble>
        ) : (
          <div />
        )}
        <Title>{name}</Title>
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
      {/* <Subtitle>Number of Alerts per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData())}</AlertMap>
      <Subtitle>Number of Warnings per Day</Subtitle>
      <AlertMap>{Heatmap(SampleData())}</AlertMap> */}
      <Footer>
        <Label onClick={handleSubscriptionsState}>Subscriptions</Label>
        <Button onClick={handleAlertsOverviewClick}>
          <StatsIcon />
        </Button>
      </Footer>
    </Automation>
  );
};
