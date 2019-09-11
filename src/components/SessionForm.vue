<template>
  <b-container>
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
import { mapState } from "vuex";

export default {
  data() {
    return {
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
  methods: {
    createSession() {}
  }
};
</script>
