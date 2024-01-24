import axios from "axios";

const apiDomain = import.meta.env.VITE_API_URL;

const setUrl = (uri: string) => `${apiDomain}${uri}`;

export const shorten = (data: { url: string }) => {
  const url = setUrl("shorten");
  return axios.post(url, data);
};
