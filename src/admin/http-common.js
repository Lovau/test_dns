import axios from "axios";
import config from "config.json";

export default axios.create({
  baseURL: config.API_DOMAIN_BASE_URL,
  headers: {
    "Content-type": "application/json",
    "x-api-key": config.API_KEY,
  },
});
