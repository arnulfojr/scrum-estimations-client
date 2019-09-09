<template>
  <div>
    <b-container>
      <b-row class="mt-3">
        <b-col>
          <b-alert variant="danger" :show="errored">{{ errorMessage }}</b-alert>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mb-3" md="5">
          <!-- we add the name of the sequence -->
          <b-card no-body>
            <h4 slot="header">
              Sequence
              <meta />
            </h4>
            <b-card-body>
              <b-form>
                <b-form-group
                  id="input-group-sequence-name"
                  description="Sequence name"
                  label="Name of the sequence"
                  label-for="input-sequence-name"
                  :state="validateSequenceName"
                  :invalid-feedback="invalidSequenceNameFeedback"
                >
                  <b-form-input
                    placeholder="Sequence name"
                    v-model="sequence.name"
                    id="input-sequence-name"
                    :state="validateSequenceName"
                  ></b-form-input>
                </b-form-group>
                <b-button
                  v-if="isSequenceSubmitable"
                  variant="primary"
                  @click="submitForm"
                  >Create</b-button
                >
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col md="7">
          <!-- We add the values -->
          <b-card no-body>
            <h4 slot="header">Sequence values</h4>
            <b-card-body>
              <b-card-text class="text-left">
                Here you can add all the values you'd need to be able to
                estimate your tasks. Usually there's only two types of values in
                a sequence, numeric values and text values. Numeric values can
                have a name to identify them and, therefore, when estimating a
                task the name would be prefered over the numeric value. This is
                the case when using T-Shirt size estimations, the name of the
                value would be
                <em>"XS"</em> and the numeric representation would be used to
                sort the values and to provide an average estimation and the
                closest possible value. If the value does <b>not</b> have a
                numeric representation then this is excluded in the estimation
                calculations but shown as an exception to the estimation
                calculations. This is the case, for example, when a
                <em>"Coffee break"</em> or a <em>"?"</em> is given as
                estimation.
              </b-card-text>
            </b-card-body>
            <b-card-body>
              <b-form>
                <b-form-group
                  id="input-group-sequence-value-value"
                  description="Sequence numeric value"
                  label="Numeric value"
                  label-for="input-sequence-value-value"
                  :state="valueIsNumeric"
                >
                  <b-form-input
                    id="input-sequence-value-value"
                    v-model="value.value"
                    :state="valueIsNumeric"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  id="input-group-sequence-value-name"
                  description="Sequence value name"
                  label="Value name"
                  label-for="input-sequence-value-name"
                  :state="nameIsPresent"
                >
                  <b-form-input
                    id="input-sequence-value-name"
                    v-model="value.name"
                    :state="nameIsPresent"
                  ></b-form-input>
                </b-form-group>
              </b-form>
              <b-button variant="success" @click="addValue">Add</b-button>
            </b-card-body>

            <b-list-group
              horizontal
              v-for="value in sequence.values"
              v-bind:key="value.value || value.name"
            >
              <b-list-group-item class="flex-fill"
                >Name: {{ value.name || "N/A" }}</b-list-group-item
              >
              <b-list-group-item class="flex-fill"
                >Value: {{ value.value || "N/A" }}</b-list-group-item
              >
              <b-list-group-item class="flex-fill">
                <b-button variant="danger" size="sm" @click="removeValue(value)"
                  >X</b-button
                >
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as R from "ramda";

export default {
  data() {
    return {
      errored: false,
      errorMessage: "",
      sequence: {
        name: "",
        values: []
      },
      value: {
        value: "",
        name: ""
      }
    };
  },
  computed: {
    valueIsNumeric() {
      return !isNaN(this.value.value);
    },
    nameIsPresent() {
      return true;
    },
    validateSequenceName() {
      return !R.isEmpty(this.sequence.name);
    },
    invalidSequenceNameFeedback() {
      if (R.isEmpty(this.sequence.name)) {
        return "Oups, can you please add a name?";
      }

      return "";
    },
    isSequenceSubmitable() {
      return (
        !R.isEmpty(this.sequence) &&
        !R.isEmpty(this.sequence.name) &&
        !R.isEmpty(this.sequence.values)
      );
    }
  },
  methods: {
    addValue() {
      if (R.isEmpty(this.value.value) && R.isEmpty(this.value.name)) {
        return;
      }

      const val = {};
      if (!R.isNil(this.value.value)) {
        let numericValue;
        try {
          numericValue = parseFloat(this.value.value);
        } catch (error) {
          return;
        }
        val.value = numericValue;
      }
      this.value.value = "";

      if (!R.isEmpty(this.value.name)) {
        val.name = this.value.name;
      }
      this.value.name = "";

      this.sequence.values.push(val);
    },
    removeValue(value) {
      const filteredValues = this.sequence.values.filter(
        v => !(v.name === value.name && v.value === value.value)
      );
      this.sequence.values = filteredValues;
    },
    async submitForm() {
      try {
        await this.$store.dispatch("sequences/create", this.sequence);
      } catch (error) {
        this.errored = true;
        this.errorMessage = R.pathOr(
          "Unknown error while creating the sequence, will try adding the values.",
          ["data", "message"],
          error
        );
      }

      if (!this.errored) this.$router.push("/sequences");
    }
  }
};
</script>
