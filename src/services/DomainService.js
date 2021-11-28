import { fetchWrapper } from "services/FetchWrapper";
import configData from "config.json";

class DomainDataService {
  getAll() {
    return fetchWrapper.get(`${configData.API_DOMAIN_BASE_URL}`);
  }

  get(id) {
    return fetchWrapper.get(`${configData.API_DOMAIN_BASE_URL}/${id}`);
  }

  create(data) {
    return fetchWrapper.put(`${configData.API_DOMAIN_BASE_URL}`, data);
  }

  update(id, data) {
    return fetchWrapper.put(`${configData.API_DOMAIN_BASE_URL}/${id}`, data);
  }

  delete(id) {
    return fetchWrapper.delete(`${configData.API_DOMAIN_BASE_URL}/${id}`);
  }
}

export default new DomainDataService();
