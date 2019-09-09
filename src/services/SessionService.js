import axios from "axios";
import * as R from "ramda";
import utils from "@/utils";

class SessionService {
  constructor(http) {
    this.http = http;
  }

  async sessionFromOrganization(organizationId, options = {}) {
    if (R.isEmpty(organizationId)) {
      throw new Error("Please provide a valid organization ID");
    }

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
}

const httpClient = axios.create({
  baseURL: utils.buildServiceUrl(process.env.VUE_APP_SESSION_SERVICE_NAME),
  timeout: 2000
});

export default new SessionService(httpClient);
