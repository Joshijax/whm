<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-form
            v-if="!showAss"
            @submit.prevent="onSubmit"
            ref="form"
            class="p-2"
          >
            <label for="scanBarcode">Scan product:</label>
            <v-text-field
              solo
              required
              name="scanBarcode"
              v-model="scanProduct"
              id="scanBarcode"
              :rules="rules"
              placeholder="Scan or type the code manually..."
              @keyup="addHyphen"
              @keypress="stopInput"
            ></v-text-field>
            <v-btn class="blue darken-2 white--text mt-5" @click="onSubmit">
              Search
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
      <assDialoger
        @closer="dialog = !dialog"
        @reset="reset"
        :dialog="dialog"
        :warehouses="warehouses"
        :product="product"
      />
      <assComp v-if="showAss" :product="product" @reset="reset" />
    </v-container>
  </div>
</template>
<!-- *************************************************************************
	SCRIPT
	************************************************************************* -->

// Scan box -> assign order box -> create box - > show products in order from ->
// scan product to complete order -> change the status to completed, also the
status of the order // scan the box status -> scan product in order again -> set
box status to finish
<script>
import axios from "axios";
import assDialoger from "../../components/whm/assDialoger.vue";

import assComp from "../../components/whm/assComp.vue";
export default {
  name: "PickingView",
  data() {
    return {
      scanProduct: "",

      showAss: false,
      warehouseName: process.env.VUE_APP_WAREHOUSE,
      warehouses: "",
      product: [],

      dialog: false,
      rules: [
        (value) => !!value || "Required.",
        (value) =>
          (value && value.split("-").join("").length === 8) ||
          "Must be 8 numbers",
      ],
    };
  },

  components: {
    assComp,
    assDialoger,
  },

  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
    addHyphen() {
      if (this.scanProduct !== "" || null) {
        let ele = this.scanProduct.split("-").join("");
        let finalVal = ele.match(/.{1,2}/g).join("-");
        this.scanProduct = finalVal;
        return finalVal;
      }
    },

    stopInput(event) {
      let ele = this.scanProduct.split("-").join("");
      if (ele.length == 8) {
        event.preventDefault(); //stop character from entering input
      }
      if (event.which != 9 && isNaN(String.fromCharCode(event.which))) {
        event.preventDefault(); //stop character from entering input
      }
    },

    onSubmit() {
      console.log("thisssss");
      if (this.$refs.form.validate()) {
        console.log(this.scanProduct);
        this.checkProduct();
      }
    },
    async checkProduct() {
      let ele = this.scanProduct.split("-").join("");
      const res = await axios.get(`api/products?sku=${ele}`);
      console.log(res.data);
      let result = await res.data[0];

      if (res.data.length !== 0) {
        if (result.warehouses.length !== 0) {
          for (let i = 0; i < result.warehouses.length; i++) {
            const element = result.warehouses[i];

            if (element.name === this.warehouseName) {
              if (element.label !== "") {
                // If it has a location => Tell the user go to the product location, put the product and scan the location
                this.product = element;
                this.showAss = true;
              } else {
                // If it has no location =>> Tell the user to find a location and associate the product to it + Input field
                this.dialog = true;
                this.warehouses = result.warehouses;
                this.product = result;
              }
            }
          }
        } else {
          // If it has no location =>> Tell the user to find a location and associate the product to it + Input field
          this.dialog = true;
        }
      } else {
        alert("wrong product sku");
      }
    },
  },
  mounted() {
    console.log(this.warehouseName, "warehouse", process.env.WAREHOUSE);
  },
};
</script>
<!-- *************************
	STYLE
	************************* -->

<style lang="scss" scoped>
label {
  color: #ffffff;
}
ul {
  list-style-type: none;
  padding-left: 0;
}
td {
  padding: 5px 30px;
  background: #f8f8f8;
}
th {
  text-align: left;
}
</style>
