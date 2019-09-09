<template>
  <div>
    <b-table
      small
      sticky-header
      primary-key="id"
      responsive="lg"
      :fields="fields"
      :items="sessions"
      :current-page="currentPage"
      :per-page="itemsPerPage"
    >
      <template v-slot:cell(membercount)="data">
        {{ data.item.members.length }} member(s)
      </template>
      <template v-slot:cell(taskcount)="data">
        {{ data.item.tasks.length }} task(s)
      </template>
      <template v-slot:cell(actions)="data">
        <b-button
          v-if="!data.item.completed"
          size="sm"
          variant="info"
          @click="goToSession(data.item)"
        >
          Open
        </b-button>
        <b-button v-if="data.item.completed" variant="info" size="sm">
          Summary
        </b-button>
      </template>
    </b-table>
    <b-list-group flush>
      <b-list-group-item>
        <b-pagination
          v-model="currentPage"
          :per-page="itemsPerPage"
          :total-rows="totalRows"
        >
        </b-pagination>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as R from "ramda";
import sessionService from "@/services/SessionService";

export default {
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Name",
          stickyColumn: true,
          sortable: true
        },
        {
          key: "completed",
          label: "Completed",
          sortable: true
        },
        {
          key: "sequence.name",
          label: "Sequence",
          sortable: true
        },
        {
          key: "membercount",
          label: "Members",
          sortable: false
        },
        {
          key: "taskcount",
          label: "Tasks",
          sortable: false
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      currentPage: 1,
      totalRows: 0,
      itemsPerPage: 15
    };
  },
  computed: {
    ...mapState(["sessions", "organization"])
  },
  mounted() {
    if (R.isNil(this.sessions) || R.isEmpty(this.sessions)) {
      this.totalRows = 0;
    } else {
      this.totalRows = this.sessions.length;
    }
  },
  async created() {
    sessionService.accessToken = await this.$auth.getAccessToken();

    const orgId = R.path(["organization", "id"], this);

    let sessions;
    try {
      sessions = await sessionService.sessionFromOrganization(orgId);
    } catch (error) {
      /* TODO: show error */
    }

    this.$store.commit("SET_ORGANIZATION_SESSIONS", sessions);
  },
  methods: {
    goToSession(session) {
      const sessionId = R.path(["id"], session);
      this.$router.push(`/sessions/${sessionId}`);
    }
  }
};
</script>
