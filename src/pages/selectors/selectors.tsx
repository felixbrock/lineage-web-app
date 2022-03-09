import React, { ReactElement, useState, useRef, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import SelectorComponent from '../../components/selector/selector';
import {
  Selectors,
  SelectorColumn,
  SelectorRow,
  FloatingButton,
  IconAdd,
  HeatmapElement,
} from './selectors-items';
import { Input, FieldLabel } from '../../components/form/form-items';
import Modal from '../../components/modal/modal';
import Button from '../../components/button/button';
import SelectorDto from '../../infrastructure/selector-api/selector-dto';
import SelectorApiRepository from '../../infrastructure/selector-api/selector-api-repository';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repository';
import AutomationApiRepository from '../../infrastructure/automation-api/automation-api-repository';
import AutomationDto from '../../infrastructure/automation-api/automation-dto';
import Table from '../../components/table/table';
import {
  buildDateKey,
  buildHeatmapData,
  DateData,
  generateDateDataStub,
  Heatmap,
  HeatmapData,
} from '../../components/heatmap/heatmap';
import SubscriptionDto from '../../infrastructure/automation-api/subscription-dto';

interface OldestAlertsAccessedOnByUser {
  selectorId: string;
  alertsAccessedOnByUser: number;
}

const isWhitespaceString = (text: string): boolean => !/\S/.test(text);

const getDateData = (
  startDate: Date,
  endDate: Date,
  selector: SelectorDto
): DateData => {
  const dateRegistry = generateDateDataStub(startDate, endDate);

  const relevantAlerts = selector.alerts.filter(
    (alert) =>
      alert.createdOn >= startDate.getTime() &&
      alert.createdOn <= endDate.getTime()
  );
  relevantAlerts.forEach((alert) => {
    dateRegistry[buildDateKey(new Date(alert.createdOn))] += 1;
  });

  return dateRegistry;
};

const getHeatmapData = (selector: SelectorDto | undefined): HeatmapData => {
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - 7 * 20 + 1);

  startDate.setUTCHours(0);
  startDate.setUTCMinutes(0);
  startDate.setUTCSeconds(0);
  startDate.setUTCMilliseconds(0);

  const endDate = new Date();
  endDate.setUTCHours(23);
  endDate.setUTCMinutes(59);
  endDate.setUTCSeconds(59);
  endDate.setUTCMilliseconds(999);

  if (!selector) return { metaData: { startDate }, series: [] };

  const dateRegistry = getDateData(startDate, endDate, selector);

  const heatmapData = buildHeatmapData(startDate, endDate, dateRegistry);

  return heatmapData;
};

const updateAlertAccessedOnValues = async (
  accountId: string,
  selectorId: string,
  jwt: string
): Promise<SubscriptionDto[]> => {
  try {
    const automations: AutomationDto[] = await AutomationApiRepository.getBy(
      new URLSearchParams({ accountId }),
      jwt
    );

    const updatedSubscriptions: SubscriptionDto[] = [];

    await Promise.all(
      automations.map(async (automation) => {
        const subscription = automation.subscriptions.find(
          (element) => element.selectorId === selectorId
        );

        if (!subscription) return;

        const updatedEntities =
          await AutomationApiRepository.updateSubscriptions(
            automation.id,
            [{ selectorId, alertsAccessedOnByUser: Date.now() }],
            jwt
          );

        updatedEntities.forEach((element) =>
          updatedSubscriptions.push(element)
        );

        if (!updatedSubscriptions || !updatedSubscriptions.length)
          throw new Error(
            `Update of subscription for selector ${selectorId} in context of automation ${automation.id} failed`
          );
      })
    );

    return updatedSubscriptions;
  } catch (error: any) {
    return Promise.reject(new Error(error.message));
  }
};

const getOldestAlertsAccessedOnByUser = async (
  accountId: string,
  selectorIds: string[],
  jwt: string
): Promise<OldestAlertsAccessedOnByUser[]> => {
  const accessedOnByUserValues: OldestAlertsAccessedOnByUser[] = [];

  try {
    const automations: AutomationDto[] = await AutomationApiRepository.getBy(
      new URLSearchParams({ accountId }),
      jwt
    );

    automations.forEach((automation) => {
      const relevantSubscriptions = automation.subscriptions.filter(
        (subscription) => selectorIds.includes(subscription.selectorId)
      );

      if (!relevantSubscriptions.length) return;

      relevantSubscriptions.forEach((subscription) => {
        const selectorAccessedOnByUser = accessedOnByUserValues.find(
          (value) => value.selectorId === subscription.selectorId
        );

        if (!selectorAccessedOnByUser)
          accessedOnByUserValues.push({
            selectorId: subscription.selectorId,
            alertsAccessedOnByUser: subscription.alertsAccessedOnByUser,
          });
        else if (
          subscription.alertsAccessedOnByUser <
          selectorAccessedOnByUser.alertsAccessedOnByUser
        ) {
          const index = accessedOnByUserValues.findIndex(
            (element) => element.selectorId === subscription.selectorId
          );
          accessedOnByUserValues[index] = {
            selectorId: subscription.selectorId,
            alertsAccessedOnByUser: subscription.alertsAccessedOnByUser,
          };
        }
      });
    });
    return accessedOnByUserValues;
  } catch (error: any) {
    return Promise.reject(new Error(error.message));
  }
};

const buildRow = (cards: ReactElement[]): ReactElement => (
  <SelectorRow>{cards}</SelectorRow>
);

const buildRows = (
  selectors: SelectorDto[],
  alertsAccessedOnByUserValues: OldestAlertsAccessedOnByUser[],
  handleSelectorId: (systemId: string) => void,
  handleSubscribersState: (state: boolean) => void,
  handleOptionsState: (state: boolean) => void,
  handleAlertsOverviewState: (state: boolean) => void,
  handleAlertsState: (state: boolean) => void,
  handleSubscribeState: (state: boolean) => void
): ReactElement[] => {
  let cards: ReactElement[] = [];
  const rows: ReactElement[] = [];

  let systemCounter = 0;

  selectors.forEach((selector) => {
    const alertAccessedOnByUser = alertsAccessedOnByUserValues.find(
      (value) => value.selectorId === selector.id
    );

    const missedAlerts = alertAccessedOnByUser
      ? selector.alerts.filter(
          (alert) =>
            alert.createdOn > alertAccessedOnByUser.alertsAccessedOnByUser
        )
      : [];

    cards.push(
      <SelectorColumn>
        {SelectorComponent(
          selector.id,
          selector.content,
          missedAlerts.length,
          handleSelectorId,
          handleSubscribersState,
          handleOptionsState,
          handleAlertsOverviewState,
          handleAlertsState,
          handleSubscribeState
        )}
      </SelectorColumn>
    );
    systemCounter += 1;
    if (systemCounter === 4) {
      rows.push(buildRow(cards));
      cards = [];
      systemCounter = 0;
    }
  });

  if (cards !== undefined && cards.length !== 0) {
    rows.push(buildRow(cards));
    cards = [];
  }

  return rows;
};

export default (props: any): ReactElement => {
  const { match } = props;
  const systemId = match.params.id;

  const initialRenderFinished = useRef(false);

  const [selectors, setSelectors] = useState<SelectorDto[]>([]);

  const [alertsAccessedOnByUser, setAlertsAccessedOnByUser] = useState<
    OldestAlertsAccessedOnByUser[]
  >([]);

  const [automationsElement, setAutomationsElement] = useState<ReactElement>();

  const [missedAlertsElement, setMissedAlertsElement] =
    useState<ReactElement>();

  const [heatmapElement, setHeatmapElement] = useState<ReactElement>();

  const [toDelete, setToDelete] = useState(false);

  const [selectorId, setSelectorId] = useState('');

  const handleSelectorId = (id: string): void => {
    setSelectorId(id);
  };

  const [showAlertsOverviewModal, setShowAlertsOverviewModal] = useState(false);

  const handleAlertsOverviewState = (): void =>
    setShowAlertsOverviewModal(!showAlertsOverviewModal);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleRegistrationState = (): void =>
    setShowRegistrationModal(!showRegistrationModal);

  const [content, setContent] = useState('');

  const [registrationSubmit, setRegistrationSubmit] = useState(false);

  const handleRegistrationSubmit = (state: boolean): void => {
    if (!content || isWhitespaceString(content)) return;
    setRegistrationSubmit(state);
    setShowRegistrationModal(!showRegistrationModal);
  };

  const [showSubscribersModal, setShowSubscribersModal] = useState(false);

  const handleSubscribersState = (): void =>
    setShowSubscribersModal(!showSubscribersModal);

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleOptionsState = (): void => setShowOptionsModal(!showOptionsModal);

  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const handleAlertsState = (): void => setShowAlertsModal(!showAlertsModal);

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const [automationId, setAutomationId] = useState('');

  const handleSubscribeState = (): void =>
    setShowSubscribeModal(!showSubscribeModal);

  const [automationSubscribe, setAutomationSubscribe] = useState(false);

  const handleAutomationSubscribe = (state: boolean): void => {
    if (!automationId || isWhitespaceString(automationId)) return;
    setAutomationSubscribe(state);
    setShowSubscribeModal(!showSubscribeModal);
  };

  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleErrorState = (): void => setShowErrorModal(!showErrorModal);

  const [systemError, setSystemError] = useState('');

  const [user, setUser] = useState<any>();

  const [accountId, setAccountId] = useState('');

  const [jwt, setJwt] = useState('');

  const renderSelectors = () => {
    setUser(undefined);
    setJwt('');
    setAccountId('');

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);

        Auth.federatedSignIn();
      });
  };

  useEffect(renderSelectors, []);

  useEffect(() => {
    if (!user) return;

    Auth.currentSession()
      .then((session) => {
        const accessToken = session.getAccessToken();

        const token = accessToken.getJwtToken();
        setJwt(token);

        return AccountApiRepository.getBy(
          new URLSearchParams({}),
          token
        );
      })
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccountId(accounts[0].id);
      })
      .catch((error) => {
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [user]);

  useEffect(() => {
    if (!accountId) return;

    if (!jwt) {
      setSystemError('No user authorization found');
      setShowErrorModal(true);
    }

    SelectorApiRepository.getBy(new URLSearchParams({ systemId }), jwt)
      .then((selectorDtos) => {
        setSelectors(selectorDtos);
        return getOldestAlertsAccessedOnByUser(
          accountId,
          selectorDtos.map((selectorDto) => selectorDto.id),
          jwt
        );
      })
      .then((accessedOnByUserValues) => {
        setAlertsAccessedOnByUser(accessedOnByUserValues);
        if (!initialRenderFinished.current)
          initialRenderFinished.current = true;
      })
      .catch((error) => {
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [accountId]);

  useEffect(() => {
    if (!initialRenderFinished.current) return;
    if (!showSubscribersModal) {
      setAutomationsElement(undefined);
      return;
    }

    AutomationApiRepository.getBy(
      new URLSearchParams({ subscriptionSelectorId: selectorId }),
      jwt
    )
      .then((automationElements) => {
        const tableContent: string[][] = automationElements.map(
          (automation) => [automation.name, automation.id]
        );
        const tableHeaders: string[] = tableContent.length
          ? ['Name', 'Id']
          : [];

        setAutomationsElement(Table(tableHeaders, tableContent));
      })
      .catch((error) => {
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [showSubscribersModal]);

  useEffect(() => {
    if (!initialRenderFinished.current) return;
    if (!showAlertsModal) {
      setMissedAlertsElement(undefined);
      updateAlertAccessedOnValues(accountId, selectorId, jwt)
        .then(() => renderSelectors())
        .catch((error) => {
          setSystemError(typeof error === 'string' ? error : error.message);
          setShowErrorModal(true);
          renderSelectors();
        });
      return;
    }

    const selector = selectors.find((element) => element.id === selectorId);

    if (!selector) {
      setSystemError(`Selector with id ${selectorId} not found`);
      setShowErrorModal(true);
      return;
    }

    const oldestAlertsAccessedOnByUser = alertsAccessedOnByUser.find(
      (value) => value.selectorId === selectorId
    );

    if (!oldestAlertsAccessedOnByUser) {
      setSystemError(
        `Oldest date of alert access was not found for selector ${selectorId}`
      );
      setShowErrorModal(true);
      return;
    }

    const alerts = selector.alerts.filter(
      (alert) =>
        alert.createdOn >= oldestAlertsAccessedOnByUser.alertsAccessedOnByUser
    );

    const tableContent: string[][] = alerts.map((alert) => [
      new Date(alert.createdOn).toISOString(),
    ]);
    const tableHeaders: string[] = tableContent.length ? ['Occurrence'] : [];

    setMissedAlertsElement(Table(tableHeaders, tableContent));
  }, [showAlertsModal]);

  useEffect(() => {
    if (!registrationSubmit || !initialRenderFinished.current) return;

    SelectorApiRepository.post(content, systemId, jwt)
      .then((selector) => {
        if (!selector)
          throw new Error(`Creation of selector ${content} failed`);

        console.log(
          `Selector ${content} sucessfully created under id ${selector.id}`
        );

        renderSelectors();

        setRegistrationSubmit(false);
      })
      .catch((error) => {
        setRegistrationSubmit(false);
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [registrationSubmit]);

  useEffect(() => {
    if (!showRegistrationModal && initialRenderFinished.current) setContent('');
  }, [showRegistrationModal]);

  useEffect(() => {
    if (!automationSubscribe || !initialRenderFinished.current) return;

    AutomationApiRepository.postSubscription(
      automationId,
      systemId,
      selectorId,
      jwt
    )
      .then((subscription) => {
        if (!subscription)
          throw new Error(
            `Subscription of automation ${automationId} to selector ${selectorId} failed`
          );

        console.log(
          `Automation ${automationId} suscessfully subscribed to selector ${selectorId}`
        );

        setAutomationId('');

        setAutomationSubscribe(false);
      })
      .catch((error) => {
        setAutomationId('');
        setAutomationSubscribe(false);
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [automationSubscribe]);

  useEffect(() => {
    if (!showSubscribeModal && initialRenderFinished.current)
      setAutomationId('');
  }, [showSubscribeModal]);

  useEffect(() => {
    if (!showErrorModal && initialRenderFinished.current) setSystemError('');
  }, [showErrorModal]);

  useEffect(() => {
    if (!toDelete || !initialRenderFinished.current) return;

    SelectorApiRepository.delete(selectorId, jwt)
      .then((deleted) => {
        if (!deleted)
          throw new Error(`Deletion of selector ${selectorId} failed`);

        console.log(`Selector ${selectorId} sucessfully deleted`);

        renderSelectors();

        setToDelete(false);
        setShowOptionsModal(false);
      })
      .catch((error) => {
        setToDelete(false);
        setSystemError(typeof error === 'string' ? error : error.message);
        setShowErrorModal(true);
      });
  }, [toDelete]);

  useEffect(() => {
    if (!initialRenderFinished.current) return;
    if (!showAlertsOverviewModal) {
      setHeatmapElement(undefined);
      return;
    }

    const selector = selectors.find((element) => element.id === selectorId);
    const heatmapData = selector
      ? getHeatmapData(selector)
      : getHeatmapData(undefined);
    setHeatmapElement(Heatmap(heatmapData));
  }, [showAlertsOverviewModal]);

  return (
    <Selectors>
      {buildRows(
        selectors,
        alertsAccessedOnByUser,
        handleSelectorId,
        handleSubscribersState,
        handleOptionsState,
        handleAlertsOverviewState,
        handleAlertsState,
        handleSubscribeState
      )}
      <FloatingButton onClick={() => setShowRegistrationModal(true)}>
        <IconAdd />
      </FloatingButton>
      {showRegistrationModal
        ? Modal(
            <form>
              <FieldLabel>Selector Content</FieldLabel>
              <Input
                type="text"
                placeholder="Enter selector content..."
                onChange={(event) => setContent(event.target.value)}
                required
              />
            </form>,
            'Register Selector',
            'Submit',
            handleRegistrationState,
            handleRegistrationSubmit
          )
        : null}
      {showSubscribersModal && automationsElement
        ? Modal(
            automationsElement,
            'Subscribed Automations',
            'Ok',
            handleSubscribersState,
            handleSubscribersState
          )
        : null}
      {showOptionsModal
        ? Modal(
            <Button onClick={() => setToDelete(true)}>Delete Selector</Button>,
            'Selector Options',
            '',
            handleOptionsState,
            handleOptionsState
          )
        : null}
      {showAlertsOverviewModal && heatmapElement
        ? Modal(
            <HeatmapElement>{heatmapElement}</HeatmapElement>,
            'Number of Alerts per Day',
            'Ok',
            handleAlertsOverviewState,
            handleAlertsOverviewState
          )
        : null}
      {showAlertsModal && missedAlertsElement
        ? Modal(
            missedAlertsElement,
            'Missed Alerts',
            'Ok',
            handleAlertsState,
            handleAlertsState
          )
        : null}
      {showSubscribeModal
        ? Modal(
            <form>
              <FieldLabel>Automation Id</FieldLabel>
              <Input
                type="text"
                placeholder="Enter automation id..."
                onChange={(event) => setAutomationId(event.target.value)}
                required
              />
            </form>,
            'Subscribe Automation to Selector',
            'Subscribe',
            handleSubscribeState,
            handleAutomationSubscribe
          )
        : null}
      {showErrorModal && systemError
        ? Modal(
            <p>{systemError}</p>,
            'An error occurred',
            'Ok',
            handleErrorState,
            handleErrorState
          )
        : null}
    </Selectors>
  );
};
