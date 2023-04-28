import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AccountApiRepository from '../../../infrastructure/account-api/account-api-repo';
import ColumnDto from '../../../infrastructure/lineage-api/columns/column-dto';
import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../../infrastructure/observability-api/test-suite-dto';

export function useSessionStorageData(...storageItems: string[]) {
  let finalStorageObject: { [index: string]: any } = {};

  for (let item of storageItems) {
    const sessionStorageItem = sessionStorage.getItem(item);
    if (!sessionStorageItem) continue;
    finalStorageObject[item] = JSON.parse(sessionStorageItem);
  }
  return finalStorageObject;
}

type ApiRepositoryResults = MaterializationDto[] | ColumnDto[] | TestSuiteDto[] | QualTestSuiteDto[] | undefined

export function useApiRepository(
  jwt: any,
  apiRepositoryCallback: any,
  urlSearchParams?: any
): [
  dtos: ApiRepositoryResults,
  setDtos: React.Dispatch<React.SetStateAction<any>>
] {
  const [dtos, setDtos] = useState();

  useEffect(() => {
    if (!jwt) return;
    if (urlSearchParams === undefined) {
      apiRepositoryCallback(jwt).then((dtos: any) => setDtos(dtos));
    } else {
      apiRepositoryCallback(new URLSearchParams({}), jwt).then((dtos: any) =>
        setDtos(dtos)
      );
    }
  }, [jwt]);

  return [dtos, setDtos];
}

export function useAccount() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [jwt, setJwt] = useState<any>();
  const [account, setAccount] = useState<any>();

  useEffect(() => {
    if (!location || !searchParams) return;

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => {
        // TODO What is the case if no cognitoUser is found?
        if (!cognitoUser) throw new Error('No Cognito User');
        Auth.currentSession()
          .then((session) => {
            const accessToken = session.getAccessToken();

            let jwtToken = accessToken.getJwtToken();
            setJwt(jwtToken);
            return AccountApiRepository.getBy(
              new URLSearchParams({}),
              jwtToken
            );
          })
          .then((accounts) => {
            if (!accounts.length) throw new Error(`No accounts found for user`);

            if (accounts.length > 1)
              throw new Error(`Multiple accounts found for user`);

            setAccount(accounts[0]);
          })
          .catch((error) => {
            console.trace(typeof error === 'string' ? error : error.message);
            caches.delete('lineage');
            sessionStorage.clear();

            Auth.signOut();
          });
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  }, [location, searchParams]);

  return [jwt, account];
}
