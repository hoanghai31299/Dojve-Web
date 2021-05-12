import axios from "axios";
import { serverURL } from "../../config";
console.log(serverURL());
const intance = axios.create({
  baseURL: serverURL(),
  withCredentials: true,
});

export default intance;
