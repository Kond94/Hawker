import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.43.244:1337/api",
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["Authorization"] =
    "Bearer 7a1661e87ead89884c45de62f060c4222b937b2dee70f5770b6052098711a8c398a7920b800e840f2ce6223b5b5adf661b3ed31a13f445fe7e11ef40c1273799e4551f188d73b50267ad21bf75876aa46a35cf744439eaa9cc91e596e57c031f857b5a5c962b2dbd2d567525910acd0f85882c5def4bfdc5fd16005fdfe2bec9";
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
