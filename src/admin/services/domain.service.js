import http from "../http-common";

class DomainDataService {
  getAll() {
    return http.get("/domains");
  }

  get(id) {
    return http.get(`/domains/${id}`);
  }

  create(data) {
    return http.put("/domains", data);
  }

  update(id, data) {
    return http.put(`/domains/${id}`, data);
  }

  delete(id) {
    return http.delete(`/domains/${id}`);
  }

  findByTitle(title) {
    return http.get(`/domains?title=${title}`);
  }
}

export default new DomainDataService();