<template>
  <div>
    <b-card v-if="profile" no-body class="overflow-hidden">
      <b-row no-gutters>
        <b-col md="3">
          <b-card-img :src="profile.picture" class="rounded-0"></b-card-img>
        </b-col>
        <b-col md="9">
          <b-card-body :title="`${profile.name} (${profile.email})`">
            <b-card-text>
              <pre>
              {{ JSON.stringify(profile, null, 2) }}
              </pre>
            </b-card-text>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: this.$auth.profile
    };
  },
  methods: {
    handleLoginEvent(data) {
      this.profile = data.profile;
    }
  }
};
</script>
