import { BehaviorSubject } from "rxjs";

import { fetchWrapper } from "services/FetchWrapper";
import Helper from "helpers/Helper";

import configData from "config.json";

const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);

/**
 * The user service handles communication between the React front-end of the Next.js tutorial app and
 * the backend API for everything related to users. It contains methods for logging in and out of the app,
 * registering a new user, and standard CRUD methods for retrieving and updating user data.
 * HTTP requests are sent with the help of the fetch wrapper.
 *
 * On successful login the returned user is stored in browser local storage to keep the user logged in between
 * page refreshes and browser sessions, if you prefer not to use local storage you can simply remove it from the
 * user service and the application will continue to work correctly, except for staying logged in between page refreshes.
 *
 * The user property exposes an RxJS Observable so any component can subscribe to be notified when a user logs in,
 * logs out or updates their profile. The notification is triggered by the call to userSubject.next() from
 * each of those methods.
 *
 * The userValue getter allows other components to easily get the current value of the logged in user without having
 * to subscribe to the user observable.
 */

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
};

function login(username, password) {
  // console.log("trying to log in with", username, password);
  return fetchWrapper
    .post(`${configData.API_USERS}/users/login`, { username, password })
    .then((user) => {
      // publish user to subscribers and store in local storage to stay logged in between page refreshes
      userSubject.next(user);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("user");
  userSubject.next(null);
  console.log("User logged out");
  // Router.push("/");
  // Router.push("/account/login");
}

function register(user) {
  user.uuid = Helper._randomstring(12);
  return fetchWrapper.put(`${configData.API_USERS}/users`, user);
}

function getAll() {
  return fetchWrapper.get(`${configData.API_USERS}/users`);
}

function getById(id) {
  return fetchWrapper.get(`${configData.API_USERS}/users/${id}`);
}

function update(id, params) {
  return fetchWrapper.put(`${configData.API_USERS}/users/${id}`, params).then((x) => {
    // update stored user if the logged in user updated their own record
    if (id === userSubject.value.id) {
      // update local storage
      const user = { ...userSubject.value, ...params };
      localStorage.setItem("user", JSON.stringify(user));

      // publish updated user to subscribers
      userSubject.next(user);
    }
    return x;
  });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
  return fetchWrapper.delete(`${configData.API_USERS}/users/${id}`);
}
