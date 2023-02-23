import { AxiosResponse } from 'axios';

export const consumeStream = (
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> => {
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

export const uint8ArrayToString = (
  uint8Array: Uint8Array,
  encoding = 'utf-8'
) => {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
};

export const writeToCache = async (
  url: string,
  response: AxiosResponse<any, any>,
  cacheName: string
): Promise<void> => {
  const cache = await caches.open(cacheName);

  const data = response.data;
  const status = response.status;
  const statusText = response.statusText;
  const headers = response.headers;

  const fetchResponse = new Response(JSON.stringify(data), {
    status: status,
    statusText: statusText,
    headers: headers,
  });
  await cache.put(url, fetchResponse);
};
