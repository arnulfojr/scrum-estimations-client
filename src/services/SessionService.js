import axios from "axios";
import * as R from "ramda";
import utils from "@/utils";

class SessionService {
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

  async create(name, sequence, organization, options = {}) {
    options = this.addAccessToken(options);

    const organizationId = R.path(["id"], organization);
    const sequenceName = R.path(["name"], sequence);
    const data = {
      name,
      organization: {
        id: organizationId
      },
      sequence: {
        name: sequenceName
      }
    };

    let response;
    try {
      response = await this.http.post("/estimations/sessions/", data, options);
    } catch (error) {
      throw R.pathOr(error, ["response"], error);
    }

    return R.path(["data"], response);
  }

  async sessionFromOrganization(organizationId, options = {}) {
    if (R.isEmpty(organizationId)) {
      throw new Error("Please provide a valid organization ID");
    }

    options = this.addAccessToken(options);

    const params = {
      organization: organizationId
    };

    options.params = params;

    let response;
    try {
      response = await this.http.get(`/estimations/sessions/`, options);
    } catch (error) {
      throw R.pathOr(error, ["response"], error);
    }

    return R.path(["data"], response);
  }

  async join(session, user, options = {}) {
    const userId = R.path(["id"], user);
    if (R.isEmpty(userId)) {
      throw new Error("Please provide a valid/non-empty user ID");
    }

    const sessionId = R.path(["id"], session);

    options = this.addAccessToken(options);

    const data = {
      user: {
        id: userId
      }
    };

    let response;
    try {
      response = await this.http.put(
        `/estimations/sessions/${sessionId}/members/`,
        data,
        options
      );
    } catch (error) {
      throw R.pathOr(error, ["response"], error);
    }

    return R.path(["data"], response);
  }

  async leave(session, user, options = {}) {
    const userId = R.path(["id"], user);
    if (R.isEmpty(userId)) {
      throw new Error("Please provide a valid/non-empty user ID");
    }

    const sessionId = R.path(["id"], session);

    options = this.addAccessToken(options);

    let response;
    try {
      response = await this.http.delete(
        `/estimations/sessions/${sessionId}/members/${userId}`,
        options
      );
    } catch (error) {
      throw R.pathOr(error, ["response"], error);
    }

    return R.path(["data"], response);
  }
}

const httpClient = axios.create({
  baseURL: utils.buildServiceUrl(process.env.VUE_APP_SESSION_SERVICE_NAME),
  timeout: 2000
});

export default new SessionService(httpClient);
