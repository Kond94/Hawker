import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";

// const apiClient = create({
//   baseURL: "http://192.168.1.56:1337/api",
// });

const apiClient = create({
  baseURL: "http://192.168.0.165:1337/api",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] =
    "Bearer a7fe444d78e5e8fc01c0a80eb6c48cea4a6ae52f002f7cbc34c625a04a9b7b15724119b6e903c028c3f286f7be516d0dee432e330dab1d7d8393f18ad1db66ace09e72b2c1c6e617552e915ff406e4459fac9e97524fd61f889deb07ba044e0d25a7ee322556a490e914a357c03a646b74569b19a664dc8d4a3c75f278725016";
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
