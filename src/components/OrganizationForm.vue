<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="12" lg="5">
          <b-card no-body>
            <h4 slot="header">Create an organization</h4>
            <b-card-body>
              <b-form @submit.stop.prevent>
                <label for="input-organization-name">Organization Name</label>
                <b-input v-model="name" id="input-organization-name" :state="validation"></b-input>
                <b-form-invalid-feedback :state="validation">The organization name is not valid.</b-form-invalid-feedback>
                <b-form-valid-feedback :state="validation">Looks Good!</b-form-valid-feedback>

                <b-button
                  type="submit"
                  variant="primary"
                  @click="createOrganization"
                >Create organization</b-button>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col md="12" lg="7">
          <b-card no-body>
            <h4 slot="header">Or search for an organization</h4>
            <b-card-body>
              <b-form @submit.stop.prevent inline>
                <label for="input-organization-namehint" class="mr-sm-2">Organization Name:</label>
                <b-input
                  id="input-organization-namehint"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder
                  v-model="nameHint"
                ></b-input>
                <b-button type="submit" variant="info" @click="searchOrganizations">Search</b-button>
              </b-form>
            </b-card-body>
            <b-list-group flush>
              <b-list-group-item
                button
                class="d-flex justify-content-between align-items-center"
                v-for="org in organizations"
                v-bind:key="org.id"
                @click="joinOrganization(org)"
              >
                <p>{{ org.name }} <small>({{ org.id }})</small></p>
                <b-badge variant="primary" pill v-if="org.users">{{ org.users.length }}</b-badge>
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
import * as R from "ramda";
import organizationService from "@/services/OrganizationService";

export default {
  data() {
    return {
      name: "",
      nameHint: "",
      organizations: []
    };
  },
  computed: {
    validation() {
      return !!this.name;
    },
    ...mapState({
      user: "user",
      accessToken: "accessToken"
    })
  },
  methods: {
    async searchOrganizations() {
      organizationService.accessToken = this.accessToken;

      this.organizations = await organizationService.all(this.nameHint);
      await this.$nextTick();
    },
    async createOrganization() {
      organizationService.accessToken = this.accessToken;

      const data = {
        name: this.name
      };

      let organization;
      try {
        organization = await organizationService.create(data);
      } catch (error) {
        // TODO: present error
      }

      // join the user to the organization
      const organizationId = R.path(["id"], organization);
      const userId = R.path(["id"], this.user);
      if (!organizationId || !userId) {
        // TODO: present error
        return;
      }

      let jointResponse;
      try {
        jointResponse = await organizationService.addUserTo(
          organizationId,
          userId
        );
      } catch (error) {
        // TODO: present error
      }

      organization = R.pathOr(organization, ["organization"], jointResponse);
      const user = R.pathOr(this.user, ["user"], jointResponse);

      this.$store.commit("SET_ORGANIZATION", organization);
      this.$store.commit("SET_USER", user);
    },
    async joinOrganization(organization) {
      const organizationId = R.path(["id"], organization);
      const userId = R.path(["id"], this.user);

      let jointResponse;
      try {
        jointResponse = await organizationService.addUserTo(
          organizationId,
          userId
        );
      } catch (error) {
        // TODO: present error
      }

      organization = R.pathOr(organization, ["organization"], jointResponse);
      const user = R.pathOr(this.user, ["user"], jointResponse);

      this.$store.commit("SET_ORGANIZATION", organization);
      this.$store.commit("SET_USER", user);
    }
  }
};
</script>