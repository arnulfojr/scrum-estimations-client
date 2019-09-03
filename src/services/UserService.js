import axios from "axios";
import * as R from "ramda";
import utils from "@/utils";

class UserService {
  accessToken = null;

  constructor(http) {
    this.http = http;
  }

  addAccessToken(options = {}) {
    if ("headers" in options) {
      options.headers["Authorization"] = `Bearer ${this.accessToken}`;
    } else {
      options["headers"] = {
        Authorization: `Bearer ${this.accessToken}`
      };
    }

    return options;
  }

  /**
   * Returns the user ID of the user, else returns false.
   */
  async exists(email, options = {}) {
    options = this.addAccessToken(options);
    options.params = { email };

    let response;
    try {
      response = await this.http.get(`/users/`, options);
    } catch (e) {
      return false;
    }

    return R.pathOr(false, ["data", "id"], response);
  }

  /**
   * Gets the user that has the user ID.
   */
  async get(id, options = {}) {
    options = this.addAccessToken(options);

    let response;
    try {
      response = await this.http.get(`/users/${id}`, options);
    } catch (error) {
      return null;
    }

    return R.path(["data"], response);
  }

  /**
   * Create a user with the given attributes.
   */
  async create(email, name, options = {}) {
    options = this.addAccessToken(options);

    const data = {
      email,
      name
    };

    let response;
    try {
      response = await this.http.post("/users/", data, options);
    } catch (error) {
      throw error;
    }

    return R.path(["data"], response);
  }

  async getUserOrganization(userId, options = {}) {
    options = this.addAccessToken(options);

    let response;
    try {
      response = await this.http.get(`/users/${userId}/organization`)
    } catch (error) {
      return null;
    }

    return R.pathOr(null, ["data"], response);
  }
}

const httpClient = axios.create({
  timeout: 2000,
  baseURL: utils.buildServiceUrl(process.env.VUE_APP_USER_SERVICE_NAME)
});

export default new UserService(httpClient);
