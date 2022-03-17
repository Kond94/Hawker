import { create } from "apisauce";

const imagesApi = create({
  baseURL: "http://192.168.1.56:1337",
});

export default imagesApi;
