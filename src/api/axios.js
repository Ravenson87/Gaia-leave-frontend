import axios from "axios"
import Cookies from "universal-cookie";
const api = process.env.REACT_APP_ENV_API

export const axiosWithToken = () => {
  return axios.create({
    baseURL: api,
    headers: {
      Authorization: `Bearer ${new Cookies().get('token')}`
    }
  });
};
