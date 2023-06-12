import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AccountApiRepository from '../../../infrastructure/account-api/account-api-repo';


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
              return AccountApiRepository.getBy(
                new URLSearchParams({}),
                // jwtToken
              );
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