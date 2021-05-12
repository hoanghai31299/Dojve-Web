import axios from "axios";

const intance = axios.create({
  baseURL: "https://dojve-server.herokuapp.com",
  withCredentials: true,
});

export default intance;
