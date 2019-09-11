<template>
  <div class="home">
    <!-- replace image with the Coount von Count from Sesame Street  -->
    <img
      alt="Vue logo"
      src="../assets/count-von-count.png"
      class="count-von-count"
    />
    <p v-if="user">Welcome {{ user.name }}!</p>
    <p v-else>Welcome anonymous!</p>
    <p v-if="organization">
      You're part of the "{{ organization.name }}" organization!
    </p>
    <p v-else>Let's get you started by joining or creating an organization!</p>
    <router-link v-if="!organization" to="/organization" tag="b-button"
      >Manage my organization</router-link
    >
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      isAuthenticated: false,
      profile: null
    };
  },
  computed: {
    ...mapState("users", {
      user: "user"
    }),
    ...mapState("organizations", {
      organization: "organization"
    })
  },
  methods: {
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  }
};
</script>

<style>
.count-von-count {
  max-height: 33vw;
}
</style>
