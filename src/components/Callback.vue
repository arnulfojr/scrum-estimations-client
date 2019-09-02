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

      let userId = await userService.exists(email);

      if (!userId) {
        try {
          await userService.create(email, name);
        } catch (error) {
          // TODO: present registration error
          return;
        }
      } else {
        await userService.get(userId);
      }

      // TODO: add state management and commit the user

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
