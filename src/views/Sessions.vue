<template>
  <div class="pt-3">
    <b-container>
      <b-row v-show="showForm" class="mb-3">
        <b-col>
          <b-card>
            <h4 slot="header">Create a session</h4>
            <session-form></session-form>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card no-body>
            <h4 slot="header">Sessions from the organization</h4>
            <b-card-body>
              <b-card-text>
                Active sessions for the organization or create a session.
              </b-card-text>
              <b-button @click="toggleForm" variant="primary">
                {{
                  showForm
                    ? "Nevermind, I'll join an existing one"
                    : "Create session"
                }}
              </b-button>
            </b-card-body>
            <session-list></session-list>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SessionList from "@/components/SessionTable";
import SessionForm from "@/components/SessionForm";

export default {
  components: {
    SessionList,
    SessionForm
  },
  data() {
    return {
      showForm: false
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    }
  }
};
</script>
