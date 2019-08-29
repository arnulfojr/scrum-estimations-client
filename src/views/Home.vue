<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <AuthButtons></AuthButtons>
  </div>
</template>

<script>
// @ is an alias to /src
import AuthButtons from "@/components/AuthButtons";

export default {
  name: "home",
  components: {
    AuthButtons
  }
};
</script>
