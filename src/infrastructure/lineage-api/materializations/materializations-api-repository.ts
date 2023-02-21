import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import appConfig from '../../../config';
import MaterializationDto from './materialization-dto';

// TODO - Implement Interface regarding clean architecture
export default class MaterializationsApiRepository {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static baseUrl = appConfig.baseUrl.lineageService;

  private static consumeStream = (
    stream: ReadableStream<Uint8Array>
  ): Promise<unknown> => {
    const reader = stream.getReader();

    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      function pump() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              const result = new Uint8Array(totalBytes);
              let offset = 0;
              for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.byteLength;
              }
              resolve(result);
            } else {
              chunks.push(value);
              totalBytes += value.byteLength;
              pump();
            }
          })
          .catch(reject);
      }

      pump();
    });
  };

  private static uint8ArrayToString(
    uint8Array: Uint8Array,
    encoding = 'utf-8'
  ) {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(uint8Array);
  }

  private static writeToCache = async (
    url: string,
    response: AxiosResponse<any, any>
  ): Promise<void> => {
    const cache = await caches.open('materializations');

    const data = response.data;
    const status = response.status;
    const statusText = response.statusText;
    const headers = response.headers;

    const fetchResponse = new Response(data, {
      status: status,
      statusText: statusText,
      headers: headers,
    });
    await cache.put(url, fetchResponse);
  };

  static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<MaterializationDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
        baseURL: MaterializationsApiRepository.baseUrl,
      };
      const url = `/${MaterializationsApiRepository.apiRoot}/${MaterializationsApiRepository.version}/materializations`;

      const fullUrl = `${config.baseURL}${url}${params.toString()}`;

      const cachedRes = await caches.match(fullUrl);

      if (cachedRes) {
        if (!cachedRes.body) throw new Error('No body in cached response');
        const data = await MaterializationsApiRepository.consumeStream(
          cachedRes.body
        );

        console.log(this.uint8ArrayToString(data));
      }

      const response = await axios.get(url, config);
      const jsonResponse = response.data;
      if (response.status === 200) {
        this.writeToCache(fullUrl, response);
        return jsonResponse;
      }
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
