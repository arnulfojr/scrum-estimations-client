import auth0 from "auth0-js";
import EventEmitter from "events";

// TODO: move to env variables
const authConfig = {
  domain: "dev-asolis.eu.auth0.com",
  clientId: "YX3MUjlwMBEL5rXd7gcTByHTrDJnlUDX"
};

const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `${window.location.origin}/callback`,
  clientID: authConfig.clientId,
  responseType: "token id_token",
  scope: "openid profile email"
});

const localStorageKey = "loggedIn";
const loginEvent = "loginEvent";

class AuthService extends EventEmitter {
  idToke = null;
  profile = null;
  tokenExpiry = null;

  accessToken = null;
  accessTokenExpiry = null;

  /**
   * Initiate the user login flow
   */
  login(customState) {
    webAuth.authorize({ appState: customState });
  }

  /**
   * Handles the authentication callback request from Auth0
   */
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult.idToken);
        }
      });
    });
  }

  /**
   * Extract the authentication result, set the localStorage variable
   * for authenticated flag and trigger an event.
   */
  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // convert the JWT expiry time from seconds to milliseconds
    this.tokenExpiry = new Date(this.profile.exp * 1000);

    // save the access token
    this.accessToken = authResult.accessToken;
    this.accessTokenExpiry = new Date(Date.now() + authResult.expiredIn * 1000);

    localStorage.setItem(localStorageKey, "true");

    this.emit(loginEvent, {
      loggedIn: true,
      profile: this.profile,
      state: authResult.appState || {}
    });
  }

  /**
   * Renew the tokes and trigger the localLogin method
   */
  renewTokens() {
    return new Promise((resolve, reject) => {
      const isUserLoggedIn = localStorage.getItem(this.localStorage);
      if (isUserLoggedIn !== "true") {
        return reject("Not logged in");
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    webAuth.logout({
      returnTo: window.location.origin
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  /**
   * Return wether or not the user session is authenticated.
   */
  isAuthenticated() {
    const isUserLoggedIn = localStorage.getItem(localStorageKey);
    return Date.now() < this.tokenExpiry && isUserLoggedIn === "true";
  }

  isAccessTokenValid() {
    return (
      this.accessToken &&
      this.accessTokenExpiry &&
      Date.now() < this.accessTokenExpiry
    );
  }

  /**
   * Returns the access token
   * Renews the access token if the current one expired.
   */
  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  }
}

export default new AuthService();
