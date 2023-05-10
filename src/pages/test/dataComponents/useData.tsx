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
  const finalStorageObject: { [index: string]: string[] } = {};

  for (const item of storageItems) {
    const sessionStorageItem = sessionStorage.getItem(item);
    if (!sessionStorageItem) continue;
    finalStorageObject[item] = JSON.parse(sessionStorageItem);
  }
  return finalStorageObject;
}

type ApiRepositoryResults =
  | MaterializationDto[]
  | ColumnDto[]
  | TestSuiteDto[]
  | QualTestSuiteDto[]
  | undefined;

export function useApiRepository(
  jwt: string,
  apiRepositoryCallback: any,
  urlSearchParams?: any // currently unused, would delete
): [
  dtos: ApiRepositoryResults,
  setDtos: React.Dispatch<React.SetStateAction<ApiRepositoryResults>>
] {
  const [dtos, setDtos] = useState<ApiRepositoryResults>();

  useEffect(() => {
    if (!jwt) return;
    if (urlSearchParams === undefined) {
      apiRepositoryCallback(jwt).then((returnedDtos: ApiRepositoryResults) =>
        setDtos(returnedDtos)
      );
    } else {
      apiRepositoryCallback(new URLSearchParams({}), jwt).then(
        (returnedDtos: ApiRepositoryResults) => setDtos(returnedDtos)
      );
    }
  }, [jwt, urlSearchParams, apiRepositoryCallback]);

  return [dtos, setDtos];
}

export function useAccount() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [jwt, setJwt] = useState<string>('');

  useEffect(() => {
    if (!location || !searchParams) return;

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => {
        // TODO What is the case if no cognitoUser is found?
        if (!cognitoUser) throw new Error('No Cognito User');
        Auth.currentSession()
          .then((session) => {
            const accessToken = session.getAccessToken();

            const jwtToken = accessToken.getJwtToken();
            setJwt(jwtToken);
            return AccountApiRepository.getBy(new URLSearchParams({}));
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

  return jwt;
}
