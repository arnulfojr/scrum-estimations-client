<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-alert :show="errored" dismissible variant="danger">
            <p>An error happened while registering... {{ errorMessage }}</p>
            <p>Please report the incident to arnulfojr94@gmail.com</p>
          </b-alert>
        </b-col>
      </b-row>
      <b-row align-v="center">
        <b-col>
          <div class="text-center" v-if="loading">
            <p>Loading...</p>
            <b-spinner variant="info" label="Text Centered"></b-spinner>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as R from "ramda";
import userService from "@/services/UserService";

export default {
  data() {
    return {
      loading: false,
      errored: false,
      errorMessage: ""
    };
  },
  methods: {
    async handleLoginEvent(data) {
      const email = R.path(["profile", "email"], data);
      const name = R.path(["profile", "name"], data);

      const accessToken = await this.$auth.getAccessToken();
      userService.accessToken = accessToken;

      this.$store.commit("SET_ACCESS_TOKEN", accessToken);

      let userId = await userService.exists(email);

      let user;
      if (!userId) {
        try {
          user = await userService.create(email, name);
        } catch (error) {
          this.loading = false;
          this.errored = true;
          this.errorMessage = R.path(["data", "message"], error);
          return;
        }
      } else {
        user = await userService.get(userId);
      }
      this.$store.commit("SET_USER", user);

      let organization = null;
      try {
        organization = await userService.getUserOrganization(userId);
      } catch (error) {
        /* ignore */
      } finally {
        this.$store.commit("SET_ORGANIZATION", organization);
      }

      this.loading = false;
      this.errored = false;

      const redirectTarget = R.pathOr("/", ["state", "target"], data);
      this.$router.push(redirectTarget);
    }
  },
  async created() {
    this.loading = true;
    try {
      await this.$auth.handleAuthentication();
    } catch (error) {
      this.loading = false;

      this.errored = true;
      this.errorMessage = R.path(["errorDescription"], error);
    }
  }
};
</script>
