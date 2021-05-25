import axios from 'axios';
import camelCase from 'camelcase-keys';
import { toast } from 'react-toastify';
import { PUBLIC_DOMAIN } from '../configs';

const axiosClient = axios.create({
  baseURL: `${PUBLIC_DOMAIN}/api/`,
  responseType: 'json',
  timeout: 10 * 1000,
  transformResponse: [(data) => camelCase(data, { deep: true })],
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle error
    console.error(error);
    toast.error(error.message);
  },
);

export default axiosClient;
