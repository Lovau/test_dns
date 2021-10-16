import axios from "axios";

export default axios.create({
  baseURL: "https://ccm35rsq84.execute-api.eu-west-1.amazonaws.com/prod",
  headers: {
    "Content-type": "application/json",
    "x-api-key": "44XlITH2DCdahKjpe4401eT5070UwdK9xBFCJMR6"
  }
});