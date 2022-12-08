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
  const [jwt, setJwt] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const handleUserFeedback = () => {
    if (!searchParams) return;

    const alertId = searchParams.get('alertId');
    const testType = searchParams.get('testType');

    if (!!alertId !== !!testType)
      throw new Error('User feedback callback is missing query param(s)');

    if (!alertId || !testType) return;

    const userFeedbackIsAnomaly = searchParams.get('userFeedbackIsAnomaly');
    if (!userFeedbackIsAnomaly) return;
    ObservabilityApiRepo.updateTestHistoryEntry(
      { alertId, userFeedbackIsAnomaly, testType },
      jwt
    )
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
    setJwt('');
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

    Auth.currentSession()
      .then((session) => {
        const accessToken = session.getAccessToken();

        const token = accessToken.getJwtToken();
        setJwt(token);

        return AccountApiRepository.getBy(new URLSearchParams({}), token);
      })
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccount(accounts[0]);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.signOut();
      });
  }, [user]);

  useEffect(() => {
    if (!account) return;

    if (!jwt) throw new Error('No user authorization found');

    handleUserFeedback();
  }, [account]);

  return (
    <>
      <Navbar current="tests" jwt={jwt} />
      <div className="fixed flex h-full w-full items-center justify-center">
        {isLoading ? (
          <LoadingScreen tailwindCss="flex w-full items-center justify-center" />
        ) : (
          <>
            <h1>{`Thanks a lot, we've adjusted our model accordingly. :)`}</h1>
          </>
        )}
      </div>
    </>
  );
};
