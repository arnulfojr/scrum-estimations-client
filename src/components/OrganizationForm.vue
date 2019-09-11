<template>
  <div>
    <b-container>
      <b-row v-if="errored">
        <b-col>
          <b-alert v-model="errored" variant="danger" dismissible>
            {{ errorMessage }}
          </b-alert>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12" lg="5">
          <b-card no-body>
            <h4 slot="header">Create an organization</h4>
            <b-card-body>
              <b-form @submit.stop.prevent>
                <label for="input-organization-name">Organization Name</label>
                <b-input
                  v-model="name"
                  id="input-organization-name"
                  :state="validation"
                ></b-input>
                <b-form-invalid-feedback :state="validation"
                  >The organization name is not valid.</b-form-invalid-feedback
                >
                <b-form-valid-feedback :state="validation"
                  >Looks Good!</b-form-valid-feedback
                >

                <b-button
                  type="submit"
                  variant="primary"
                  @click="createOrganization"
                  >Create organization</b-button
                >
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col md="12" lg="7">
          <b-card no-body>
            <h4 slot="header">Or search for an organization</h4>
            <b-card-body>
              <b-form @submit.stop.prevent inline>
                <label for="input-organization-namehint" class="mr-sm-2"
                  >Organization Name:</label
                >
                <b-input
                  id="input-organization-namehint"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  placeholder
                  v-model="nameHint"
                ></b-input>
                <b-button
                  type="submit"
                  variant="info"
                  @click="searchOrganizations"
                  >Search</b-button
                >
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
                <p>
                  {{ org.name }} <small>({{ org.id }})</small>
                </p>
                <b-badge variant="primary" pill v-if="org.users">{{
                  org.users.length
                }}</b-badge>
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

export default {
  data() {
    return {
      name: "",
      nameHint: "",
      organizations: [],
      errored: false,
      errorMessage: ""
    };
  },
  computed: {
    validation() {
      return !!this.name;
    },
    ...mapState("users", ["user"])
  },
  methods: {
    async searchOrganizations() {
      this.organizations = await this.$store.dispatch(
        "organizations/search",
        this.nameHint
      );
      await this.$nextTick();
    },
    async createOrganization() {
      this.errored = false;

      const data = {
        organization: {
          name: this.name
        },
        user: this.user
      };

      try {
        await this.$store.dispatch("organizations/create", data);
      } catch (error) {
        this.errored = true;
        this.errorMessage = R.path(["data"], error);
      }
    },
    async joinOrganization(organization) {
      const data = {
        organization,
        user: this.user
      };

      try {
        await this.$store.dispatch("organizations/join", data);
      } catch (error) {
        this.errored = true;
        const data = R.path(["data"], error);
        this.errorMessage = `The organization was created but we failed to add the user to it... ${data}`;
      }
    }
  }
};
</script>
