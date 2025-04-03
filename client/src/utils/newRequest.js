import axios from "axios";

const newRequest = axios.create({
  baseURL: "/api/"
});

export default newRequest;