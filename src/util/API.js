import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/sickkids-f3f02/us-central1/api",
  responseType: "json",
  headers: {
    common: {
      Authorization: localStorage.getItem('AuthToken')
    }
  }
});