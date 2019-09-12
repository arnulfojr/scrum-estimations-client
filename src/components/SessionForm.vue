<template>
  <b-container>
    <b-row>
      <b-col>
        <b-alert v-model="errored" variant="danger">
          {{ errorMessage }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form>
          <b-form-group
            id="input-group-name"
            label="Name"
            label-for="input-name"
          >
            <b-form-input
              id="input-name"
              v-model="name"
              placeholder="Session name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-sequence"
            label="Sequences"
            label-for="input-sequence"
          >
            <b-form-select
              id="input-sequence"
              v-model="sequence"
              :options="sequenceOptions"
              required
            ></b-form-select>
          </b-form-group>
          <b-button variant="success" @click="createSession">Create</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import * as R from "ramda";
import { mapState } from "vuex";

export default {
  data() {
    return {
      errorMessage: "",
      errored: false,
      name: "",
      sequence: {}
    };
  },
  computed: {
    sequenceOptions() {
      return this.sequences.map(seq => {
        return {
          value: seq,
          text: seq.name
        };
      });
    },
    ...mapState("sequences", ["sequences"]),
    ...mapState("organizations", ["organization"])
  },
  async created() {
    try {
      await this.$store.dispatch("sequences/fetchAll");
    } catch (error) {
      this.errored = true;
      this.errorMessage = R.pathOr(error, ["message"], error);
    }
  },
  methods: {
    async createSession() {
      const data = {
        name: this.name,
        sequence: this.sequence,
        organization: this.organization
      };

      try {
        await this.$store.dispatch("sessions/create", data);
      } catch (error) {
        this.errored = true;
        this.errorMessage = R.pathOr(
          "Error while trying to create the session, please try again later",
          ["message"],
          error
        );
        return;
      } finally {
        // let it load once it finishes, no need to await it
        this.$store.dispatch("sessions/fetchForOrganization", {
          organizationId: R.path(["organization", "id"], this)
        });
      }

      this.name = "";
      this.sequence = {};
    }
  }
};
</script>
