<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-alert variant="danger" v-if="errored">{{ errorMessage }}</b-alert>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3" lg="5">
          <b-card no-body>
            <h4 slot="header">Sequences available</h4>
            <b-card-body>
              <b-card-text
                >The following are the sequences that are available to start an
                estimation session with.</b-card-text
              >
            </b-card-body>

            <b-list-group flush>
              <b-list-group-item
                v-for="sequence in sequences"
                v-bind:key="sequence.name"
                v-bind:class="{ active: sequence.active }"
                @click="showSequenceInfoFor(sequence)"
                button
              >
                {{ sequence.name }}
              </b-list-group-item>
              <b-list-group-item>
                <router-link to="/sequences/create"
                  >Create new sequence</router-link
                >
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>

        <b-col v-if="selectedSequence" class="mt-3" lg="7">
          <b-card no-body>
            <h4 slot="header">{{ selectedSequence.name }}</h4>
            <b-list-group>
              <b-list-group-item
                v-for="value in selectedSequence.values"
                v-bind:key="value.id"
                class="flex-column align-items-start"
              >
                <b-list-group horizontal>
                  <b-list-group-item class="flex-fill">
                    <small><b>ID:</b> {{ value.id }}</small>
                  </b-list-group-item>
                  <b-list-group-item
                    v-if="value.value !== null"
                    class="flex-fill"
                  >
                    <b>Value:</b> {{ value.value }}
                  </b-list-group-item>
                  <b-list-group-item v-if="value.name" class="flex-fill">
                    <b>Name:</b> {{ value.name }}
                  </b-list-group-item>
                </b-list-group>
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
import sequenceService from "@/services/SequenceService";

export default {
  data() {
    return {
      errored: false,
      errorMessage: "",
      selectedSequence: null
    };
  },
  computed: {
    ...mapState(["sequences"])
  },
  async created() {
    sequenceService.accessToken = await this.$auth.getAccessToken();

    let sequences;
    try {
      sequences = await sequenceService.all();
    } catch (error) {
      this.errored = true;
      this.errorMessage = error;
      sequences = [];
    } finally {
      for (const seq of sequences) {
        seq.active = false;
      }

      this.$store.commit("SET_SEQUENCES", sequences);
    }
  },
  methods: {
    setActive(sequence) {
      for (const seq of this.sequences) {
        seq.active = false;
      }

      sequence.active = true;
    },
    showSequenceInfoFor(sequence) {
      this.setActive(sequence);

      const selectedSequenceId = R.path(["selectedSequence", "id"], this);
      if (selectedSequenceId && selectedSequenceId === sequence.id) {
        this.selectedSequence = null;
      } else {
        this.selectedSequence = sequence;
      }
    }
  }
};
</script>

<style scoped>
.text-left-align {
  text-align: left;
}
</style>
