import axios from 'axios';
import camelCase from 'camelcase-keys';
import { toast } from 'react-toastify';
import { PUBLIC_DOMAIN } from '../configs';

const axiosClientInfiniteTime = axios.create({
  baseURL: `${PUBLIC_DOMAIN}/api/`,
  responseType: 'json',
  transformResponse: [(data) => camelCase(data, { deep: true })],
});

axiosClientInfiniteTime.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClientInfiniteTime.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle error
    console.error(error);
    toast.error(error.message);
  },
);

export default axiosClientInfiniteTime;
