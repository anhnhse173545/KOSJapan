import axios from "axios";
const api = axios.create({
    baseURL: "http://103.90.227.68:8080/api/", //server BE
  });
  
  export default api;

  //u