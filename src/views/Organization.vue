<template>
  <div>
    <organization-form v-if="!organization"></organization-form>
    <div v-else>
      <b-container>
        <b-row class="justify-content-md-center">
          <b-col lg="6">
            <b-card no-body>
              <h4 slot="header">My organization</h4>
              <b-card-body>
                <b-card-text>
                  Name: {{ organization.name }}
                </b-card-text>
                <b-button size="sm" variant="danger" @click="leaveOrganization">Leave</b-button>
              </b-card-body>
              <b-list-group flush>
                <b-list-group-item v-for="user in organization.users" v-bind:key="user.id">
                  {{ user.email }}
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as R from "ramda";
import OrganizationForm from "@/components/OrganizationForm";
import organizationService from "@/services/OrganizationService";

export default {
  components: {
    OrganizationForm
  },
  computed: {
    ...mapState(["organization", "user", "accessToken"]),
  },
  methods: {
    async leaveOrganization() {
      organizationService.accessToken = this.accessToken;
      const organizationId = R.path(["id"], this.organization);
      const userId = R.path(["id"], this.user);

      try {
        await organizationService.leave(organizationId, userId);
      } catch (error) {/* ignore */}

      this.$store.commit('SET_ORGANIZATION', null);
    }
  }
}
</script>