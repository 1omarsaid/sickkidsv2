import axios from "axios";

const API = axios.create({
  baseURL: "https://us-central1-sickkids-f3f02.cloudfunctions.net/api",
  // baseURL: "http://localhost:5001/sickkids-f3f02/us-central1/api",
  responseType: "json",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // common: {
    //   Authorization: localStorage.getItem('AuthToken')
    // }
  }
});

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('AuthToken');
    debugger
    if(token) {
      config.headers.Authorization = `${token}`;
    }else{
      delete API.defaults.headers.common.Authorization;
    }

    return config
  },
  error => Promise.reject(error)
);

export default API;