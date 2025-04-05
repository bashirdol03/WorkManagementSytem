import axios from "axios";

const newRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8078/api",
  withCredentials: true, 
});

export default newRequest;