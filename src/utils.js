const defaultProtocol = process.env.VUE_APP_SERVICE_PROTOCOL;
const defaultServiceHost = process.env.VUE_APP_SERVICE_HOST;

export default {
  /**
   * Build the service url based on the service name, protocol and host.
   */
  buildServiceUrl(
    serviceName,
    protocol = defaultProtocol,
    host = defaultServiceHost
  ) {
    if (!serviceName || serviceName === "") {
      return `${protocol}://${host}`;
    } else {
      return `${protocol}://${serviceName}.${host}`;
    }
  }
};
