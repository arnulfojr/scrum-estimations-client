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

      let user;
      try {
        user = await this.$store.dispatch("users/ensureUser", {
          email,
          name
        });
      } catch (error) {
        this.loading = false;
        this.errored = true;
        this.errorMessage = R.pathOr(
          "Error while creating user.",
          ["message"],
          error
        );
        return;
      }

      const userId = R.path(["id"], user);

      let organization;
      try {
        organization = await this.$store.dispatch("users/getOrganization", {
          userId
        });
      } catch (ignore) {
        /* ignore */
      }

      this.$store.commit("organizations/SET_ORGANIZATION", organization);

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
