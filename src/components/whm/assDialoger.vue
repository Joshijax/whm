<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <template>
        <v-card>
          <v-toolbar color="primary" dark>Opening from the bottom</v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="order">
                <v-form
                  ref="form"
                  v-on:submit.prevent="onSubmit"
                  style="margin-top: 20px"
                >
                  <label for="scanBarcode"
                    >Put the product on a new location:</label
                  >
                  <v-text-field
                    solo
                    v-model="locationScan"
                    placeholder="Scan or type the location manually..."
                    :rules="rules"
                    @keyup="addHyphen"
                    @keypress="stopInput"
                  ></v-text-field>

                  <v-btn
                    class="blue darken-2 white--text mt-5"
                    @click="onSubmit"
                  >
                    Search
                  </v-btn>
                </v-form>

                <div
                  style="justify-content: space-between; font-size: 20px"
                  class="w-100 d-flex justify-content-space-between"
                ></div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="closer">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  name: "assDialoger",
  data() {
    return {
      //   dialog: true,
      valid: true,
      locationScan: "",
      warehouseName: process.env.VUE_APP_WAREHOUSE,
      rules: [
        (value) => !!value || "Required.",
        (value) =>
          (value && value.split("-").join("").length === 8) ||
          "Must be 8 numbers",
      ],
    };
  },

  props: ["dialog", "warehouses", "product"],

  methods: {
    closer() {
      console.log("the close");
      this.$emit("closer");
    },

    onSubmit() {
      console.log("thisssss");
      if (this.$refs.form.validate()) {
        let updWarehouse = this.warehouses.map((item) =>
          item.name === this.warehouseName
            ? { ...item, label: this.locationScan }
            : item
        );

        axios.patch(`api/products/${this.product.id}`, {
          warehouses: updWarehouse,
        });
        this.closer();
        // window.location.reload();
        this.$emit("reset");
        console.log(updWarehouse);
        console.log(this.product);
      }
    },
    addHyphen() {
      if (this.locationScan !== "" || null) {
        let ele = this.locationScan.split("-").join("");
        let finalVal = ele.match(/.{1,2}/g).join("-");
        this.locationScan = finalVal;
        return finalVal;
      }
    },

    stopInput(event) {
      let ele = this.locationScan.split("-").join("");
      if (ele.length == 8) {
        event.preventDefault(); //stop character from entering input
      }
      if (event.which != 9 && isNaN(String.fromCharCode(event.which))) {
        event.preventDefault(); //stop character from entering input
      }
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
