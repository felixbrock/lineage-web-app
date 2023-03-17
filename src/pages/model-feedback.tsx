import { Auth } from 'aws-amplify';
import { ReactElement, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingScreen from '../components/loading-screen';
import Navbar from '../components/navbar';
import AccountDto from '../infrastructure/account-api/account-dto';
import ObservabilityApiRepo from '../infrastructure/observability-api/observability-api-repo';
import AccountApiRepository from '../infrastructure/account-api/account-api-repo';

export default (): ReactElement => {
  const [searchParams] = useSearchParams();

  const [account, setAccount] = useState<AccountDto>();
  const [user, setUser] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);

  const handleUserFeedback = () => {
    if (!searchParams) return;

    const alertId = searchParams.get('alertId');
    const testType = searchParams.get('testType');
    const userFeedbackIsAnomaly = searchParams.get('userFeedbackIsAnomaly');

    if (!alertId || !testType || !userFeedbackIsAnomaly)
      throw new Error('User feedback callback is missing query param(s)');

    const testSuiteId = searchParams.get('testSuiteId');
    const importance = searchParams.get('importance');
    const boundsIntervalRelative = searchParams.get('boundsIntervalRelative');
    if (
      userFeedbackIsAnomaly === '0' &&
      !(importance || testSuiteId || boundsIntervalRelative)
    )
      throw new Error(
        'Expected importance, boundsIntervalRelative and testSuiteId value for reported false-positive '
      );

    ObservabilityApiRepo.adjustDetectedAnomaly({
      alertId,
      userFeedbackIsAnomaly,
      testType,
      importance: importance || undefined,
      boundsIntervalRelative: boundsIntervalRelative || undefined,
      testSuiteId: testSuiteId || undefined,
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        console.trace(
          'Something went wrong saving user feedback to persistence'
        );
      });
  };

  const handleFeedback = () => {
    setUser(undefined);
    setAccount(undefined);

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  };

  useEffect(handleFeedback, []);

  useEffect(() => {
    if (!user) return;

    AccountApiRepository.getBy(new URLSearchParams({}))
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccount(accounts[0]);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
        sessionStorage.clear();

        Auth.signOut();
      });
  }, [user]);

  useEffect(() => {
    if (!account) return;

    handleUserFeedback();
  }, [account]);

  return (
    <>
      <Navbar current="tests" />
      <div className="fixed flex h-full w-full items-center justify-center">
        {isLoading ? (
          <LoadingScreen tailwindCss="flex w-full items-center justify-center" />
        ) : (
          <>
            <h1>{`Thanks a lot, we've adjusted your model accordingly :)`}</h1>
          </>
        )}
      </div>
    </>
  );
};
