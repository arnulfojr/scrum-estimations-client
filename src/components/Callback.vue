<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
import * as R from "ramda";
import userService from "@/services/UserService";

export default {
  methods: {
    async handleLoginEvent(data) {
      const email = R.path(["profile", "email"], data);
      const name = R.path(["profile", "name"], data);

      const accessToken = await this.$auth.getAccessToken();
      userService.accessToken = accessToken;
      
      this.$store.commit('SET_ACCESS_TOKEN', accessToken);

      let userId = await userService.exists(email);

      let user;
      if (!userId) {
        try {
          user = await userService.create(email, name);
        } catch (error) {
          // TODO: present registration error
          return;
        }
      } else {
        user = await userService.get(userId);
      }
      this.$store.commit('SET_USER', user);

      let organization = null;
      try {
        organization = await userService.getUserOrganization(userId);
      } catch (error) {/* ignore */}
      finally {
        this.$store.commit('SET_ORGANIZATION', organization);
      }

      const redirectTarget = R.pathOr("/", ["state", "target"], data);
      this.$router.push(redirectTarget);
    }
  },
  async created() {
    try {
      await this.$auth.handleAuthentication();
    } catch (error) {
      /* ignore */
    }
  }
};
</script>
