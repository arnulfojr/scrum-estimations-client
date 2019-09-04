import axios from "axios";
import * as R from "ramda";
import utils from "@/utils";

class OrganizationService {
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

  async all(hint = "", options = {}) {
    options = this.addAccessToken(options);

    options["params"] = {
      name: hint
    };

    let response;
    try {
      response = await this.http.get("/organizations/", options);
    } catch (error) {
      return [];
    }

    return R.pathOr([], ["data"], response);
  }

  async create(data, options = {}) {
    options = this.addAccessToken(options);

    let response;
    try {
      response = await this.http.post("/organizations/", data, options);
    } catch (error) {
      throw error.response;
    }

    return R.path(["data"], response);
  }

  async addUserTo(organizationId, userId, options = {}) {
    options = this.addAccessToken(options);

    const data = {
      user: {
        id: userId
      }
    };

    let response;
    try {
      response = await this.http.post(
        `/organizations/${organizationId}/users`,
        data,
        options
      );
    } catch (error) {
      throw error.response;
    }

    return R.path(["data"], response);
  }

  async leave(organizationId, userId, options = {}) {
    options = this.addAccessToken(options);

    try {
      await this.http.delete(
        `/organizations/${organizationId}/users/${userId}`,
        options
      );
    } catch (error) {
      return false;
    }

    return true;
  }
}

const httpClient = axios.create({
  timeout: 2000,
  baseURL: utils.buildServiceUrl(process.env.VUE_APP_ORGANIZATION_SERVICE_NAME)
});

export default new OrganizationService(httpClient);
