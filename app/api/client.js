import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.43.100:1337/api",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] =
    "Bearer 78f125a2dbcd1fbfd6e36ba25dab3e701fe43066aeac224a60e12aea1689b6c70503b7c443a1ddabb212c544a82ce988b2bc10222412ce45ae9d183be3d2b4ed7be27c8ca2732d4ea557d8627e0bd123695670e76c0963151e4d86363f48df07f368c0d1de2fcacc2a639483cb6f4b70cfd1b25abf2747fd0a32ee9c54afd090";
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
