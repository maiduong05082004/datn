import axios from 'axios';

const instance = axios.create({
  baseURL: `http://127.0.0.1:8000/`,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user');
    const cleanToken = token ? token.replace(/"/g, "") : null;

    if (cleanToken) {
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
