<template>
  <div class="pt-3">
    <organization-form v-if="!organization"></organization-form>
    <organization-card v-else></organization-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OrganizationForm from "@/components/OrganizationForm";
import OrganizationCard from "@/components/OrganizationCard";

export default {
  components: {
    OrganizationForm,
    OrganizationCard
  },
  computed: {
    ...mapState("organizations", {
      organization: state => state.organization
    })
  }
};
</script>
