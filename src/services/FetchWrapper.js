import { userService } from "services/UserService";
import configData from "config.json";

/**
 * The fetch wrapper is a lightweight wrapper around the native browser fetch() function used to simplify
 * the code for making HTTP requests. It contains methods for get, post, put and delete requests, it automatically
 * handles the parsing of JSON data from responses, and throws an error if the HTTP response is not successful (!response.ok).
 * If the response is 401 Unauthorized or 403 Forbidden the user is automatically logged out of the Next.js app.
 *
 * The authHeader() function is used to automatically add a JWT auth token to the HTTP Authorization header of
 * the request if the user is logged in and the request is to the application api url.
 *
 * With the fetch wrapper a POST request can be made as simply as this: fetchWrapper.post(url, body);.
 * It's used by the user service
 * More information on: https://jasonwatmore.com/post/2020/04/18/fetch-a-lightweight-fetch-wrapper-to-simplify-http-requests
 */
export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const requestOptions = {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      ...authHeader(url),
    },
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const user = userService.userValue;
  const isLoggedIn = user && user.token;
  const isApiUrl =
    url.startsWith(configData.API_USERS) || url.startsWith(configData.API_DOMAIN_BASE_URL);
  if (isLoggedIn && isApiUrl) {
    return {
      Authorization: `Bearer ${user.token}`,
      "x-api-key": configData.API_KEY,
    };
  } else {
    return {
      "x-api-key": configData.API_KEY,
    };
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && userService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        // userService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
