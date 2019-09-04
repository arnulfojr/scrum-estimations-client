import axios from "axios";
import * as R from "ramda";
import utils from "@/utils";

class SequenceService {
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

  async all(options = {}) {
    options = this.addAccessToken(options);

    let response;
    try {
      response = await this.http.get("/estimations/sequences", options);
    } catch (error) {
      throw R.pathOr(error, ["response", "data"], error);
    }

    return R.path(["data"], response);
  }

  async create(name, options = {}) {
    options = this.addAccessToken(options);

    const data = {
      name
    };

    let response;
    try {
      response = await this.http.post("/estimations/sequences/", data, options);
    } catch (error) {
      throw R.pathOr(error, ["response"], error);
    }

    return R.path(["data"], response);
  }

  async addValuesTo(sequenceName, values = [], options = {}) {
    options = this.addAccessToken(options);

    if (R.isEmpty(values)) {
      throw new Error("We need values!");
    }

    const cleanedValues = values.filter(
      v => !(R.isEmpty(v) || (R.isEmpty(v.name) && R.isEmpty(v.value)))
    );
    const data = cleanedValues;

    let response;
    try {
      response = await this.http.post(
        `/estimations/sequences/${sequenceName}/values/`,
        data,
        options
      );
    } catch (error) {
      throw R.pathOr(error, ["response"], error);
    }

    return R.path(["data"], response);
  }
}

const httpClient = axios.create({
  timeout: 2000,
  baseURL: utils.buildServiceUrl(process.env.VUE_APP_ESTIMATIONS_SERVICE_NAME)
});

export default new SequenceService(httpClient);
