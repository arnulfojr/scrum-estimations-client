<template>
  <div>
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col lg="6">
          <b-card no-body>
            <h4 slot="header">My organization</h4>
            <b-card-body>
              <b-card-text> Name: {{ organization.name }} </b-card-text>
              <b-button size="sm" variant="danger" @click="leaveOrganization"
                >Leave</b-button
              >
            </b-card-body>
            <b-list-group flush>
              <b-list-group-item
                v-for="user in organization.users"
                v-bind:key="user.id"
              >
                {{ user.email }}
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("organizations", {
      organization: state => state.organization
    }),
    ...mapState(["user"])
  },
  methods: {
    async leaveOrganization() {
      try {
        await this.$store.dispatch("organizations/leave", {
          organization: this.organization,
          user: this.user
        });
      } catch (error) {
        /* ignore */
      }
    }
  }
};
</script>
