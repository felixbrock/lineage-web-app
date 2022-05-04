import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../../shared/api-root-builder';
import LineageDto from './lineage-dto';

// TODO - Implement Interface regarding clean architecture
export default class LineageApiRepository {
  private static root = getRoot('lineage', '3000', 'api/v1');

  public static getOne = async (
    id: string,
    jwt: string
  ): Promise<LineageDto | null> => {
    try {
      const apiRoot = await LineageApiRepository.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${apiRoot}/lineage/${id}`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
