<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closer">
            scan another
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('continueBox', mainBoxId)"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "dialoger",
  data() {
    return {
      // dialog: true,
    };
  },

  props: ["dialog", "box", "order", "mainBoxId", "message", "title"],

  methods: {
    closer() {
      console.log("the close");
      this.$emit("closer");
    },
  },

  mounted() {
    console.log(this.order, "mounted");
  },

  updated() {
    console.log(this.mainBoxId, "updated");
  },
};
</script>

<style></style>
