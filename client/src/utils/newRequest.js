import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://wmstool.onrender.com/api",
  withCredentials: true, 
});

export default newRequest;