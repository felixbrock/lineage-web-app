import { Auth } from 'aws-amplify';
import axios from 'axios';

const getApiClient = (baseURL: string) => {
  const api = axios.create({
    baseURL,
  });

  api.interceptors.request.use(async (config) => {
    try {
      const session = await Auth.currentSession();
      const token = session.getAccessToken().getJwtToken();

      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
      };
    } catch (e: any) {
      console.trace(typeof e === 'string' ? e : e.message);
      caches.delete('lineage');
      sessionStorage.clear();

      Auth.signOut();
    }
  });

  return api;
};
export default getApiClient;
