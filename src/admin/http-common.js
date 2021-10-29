import axios from "axios";

export default axios.create({
  baseURL: "https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod",
  headers: {
    "Content-type": "application/json",
    "x-api-key": "ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04"
  }
});