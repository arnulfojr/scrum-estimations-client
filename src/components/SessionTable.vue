<template>
  <div>
    <b-table
      small
      sticky-header
      primary-key="id"
      responsive="sm"
      :fields="fields"
      :items="sessions"
      :current-page="currentPage"
      :per-page="itemsPerPage"
    >
      <template v-slot:cell(membercount)="data">
        {{ data.item.members ? data.item.members.length : 0 }} member(s)
      </template>
      <template v-slot:cell(taskcount)="data">
        {{ data.item.tasks ? data.item.tasks.length : 0 }} task(s)
      </template>
      <template v-slot:cell(actions)="data">
        <b-button-group>
          <b-button
            v-if="!data.item.completed"
            size="sm"
            variant="info"
            @click="goToSession(data.item)"
          >
            Open
          </b-button>
          <b-button
            v-if="!isMemberOfSession(data.item)"
            size="sm"
            variant="info"
            @click="joinSession(data.item)"
          >
            Join
          </b-button>
          <b-button
            v-else
            size="sm"
            variant="danger"
            @click="leaveSession(data.item)"
          >
            Leave
          </b-button>
          <b-button v-if="data.item.completed" variant="info" size="sm">
            Summary
          </b-button>
        </b-button-group>
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
    ...mapState("sessions", ["sessions"]),
    ...mapState("organizations", ["organization"]),
    ...mapState("users", ["user"])
  },
  mounted() {
    if (R.isNil(this.sessions) || R.isEmpty(this.sessions)) {
      this.totalRows = 0;
    } else {
      this.totalRows = this.sessions.length;
    }
  },
  async created() {
    const organizationId = R.path(["organization", "id"], this);
    await this.$store.dispatch("sessions/fetchForOrganization", {
      organizationId
    });
  },
  methods: {
    isMemberOfSession(session) {
      const members = R.path(["members"], session);
      if (R.isNil(members) || R.isEmpty(members)) return false;

      const userId = R.path(["user", "id"], this);
      const email = R.path(["user", "email"], this);

      const member = members.find(m => m.id === userId || m.email === email);
      return !R.isNil(member);
    },
    async joinSession(session) {
      try {
        await this.$store.dispatch("sessions/join", {
          organization: this.organization,
          session,
          user: this.user
        });
      } catch (error) {
        /* ignore */
      }
    },
    async leaveSession(session) {
      try {
        await this.$store.dispatch("sessions/leave", {
          organization: this.organization,
          session,
          user: this.user
        });
      } catch (error) {
        /* ignore */
      }
    },
    goToSession(session) {
      const sessionId = R.path(["id"], session);
      this.$router.push(`/sessions/${sessionId}`);
    }
  }
};
</script>
