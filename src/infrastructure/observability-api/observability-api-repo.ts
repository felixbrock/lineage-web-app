import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../shared/api-root-builder';

interface UpdateTestHistoryEntryDto {
  alertId: string;
  userFeedbackIsAnomaly: string;
}

// TODO - Implement Interface regarding clean architecture
export default class ObservabilityApiRepo {
  private static root = getRoot('observability', '3012', 'api/v1');

  public static updateTestHistoryEntry = async (
    updateTestHistoryEntryDto: UpdateTestHistoryEntryDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const data = {
        userFeedbackIsAnomaly: updateTestHistoryEntryDto.userFeedbackIsAnomaly,
      };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${apiRoot}/test-suite/history/${updateTestHistoryEntryDto.alertId}`,
        data,
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
