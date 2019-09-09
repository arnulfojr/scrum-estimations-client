import * as R from "ramda";
import sequenceService from "@/services/SequenceService";

const actions = {
  async fetchAll({ dispatch, commit, state }) {
    const accessToken = await dispatch("setAccessToken", null, { root: true });
    sequenceService.accessToken = accessToken;

    let sequences = await sequenceService.all();

    sequences = sequences.map(seq => {
      const name = R.path(["name"], seq);
      const selectedName = R.path(["selectedSequence", "name"], state);

      seq.active = name === selectedName;

      return seq;
    });

    commit("SET_SEQUENCES", sequences);

    return sequences;
  },
  async create({ dispatch }, { name, values = [] }) {
    const accessToken = await dispatch("setAccessToken", null, { root: true });
    sequenceService.accessToken = accessToken;

    await sequenceService.create(name);

    if (!R.isEmpty(values)) {
      await dispatch("assignValuesTo", {
        name,
        values
      });
    }
  },
  async assignValuesTo({ dispatch }, { name, values = [] }) {
    const accessToken = await dispatch("setAccessToken", null, { root: true });
    sequenceService.accessToken = accessToken;

    await sequenceService.addValuesTo(name, values);
  }
};

const getters = {};

const mutations = {
  SET_SELECTED_SEQUENCE: (state, sequence) => {
    for (const sequence of state.sequences) {
      sequence.active = false;
    }

    if (!R.isNil(sequence)) sequence.active = true;
    state.selectedSequence = sequence;
  },
  SET_SEQUENCES: (state, sequences = []) => {
    state.sequences = sequences;
  }
};

const state = {
  sequences: [],
  selectedSequence: null
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
