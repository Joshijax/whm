<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="order">
        <p>Comenzi in asteptare:</p>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-on:submit.prevent="onSubmit"
        >
          <label for="scanBarcode">Scan a scan product when in location:</label>
          <v-text-field
            solo
            v-model="productScan"
            placeholder="Scan or type the location manually..."
            :rules="rules"
            :autofocus="true"
            @keyup="addHyphen"
            @keypress="stopInput"
          ></v-text-field>

          <v-btn class="blue darken-2 white--text mt-5" @click="onSubmit">
            Search
          </v-btn>
        </v-form>

        <div :key="item.id" v-for="item in loc.associated_products">
          <inventProduct @restart="restart" :item="item" />
        </div>

        <div
          style="justify-content: space-between; font-size: 20px"
          class="w-100 d-flex justify-content-space-between"
        >
          <v-btn
            @click="$emit('finishInvent')"
            :class="[finisher ? 'green' : 'grey', 'darken-2 white--text mt-5']"
            >Finish Invent</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import inventProduct from "./inventProduct.vue";
export default {
  name: "inventComp",

  data() {
    return {
      valid: true,

      productScan: "",
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
    };
  },
  components: {
    inventProduct,
  },
  props: ["loc", "finisher"],

  methods: {
    restart(val) {
      console.log(val, "got it");
      this.$emit("restart", val);
    },
    async onSubmit() {
      if (this.$refs.form.validate()) {
        let val = this.productScan.split("-").join("");
        console.log(val);

        this.$emit("scanProduct", val);

        this.productScan = "";
      }
    },

    addHyphen() {
      if (this.productScan !== "" || null) {
        let ele = this.productScan.split("-").join("");
        let finalVal = ele.match(/.{1,2}/g).join("-");
        this.productScan = finalVal;
        return finalVal;
      }
    },

    stopInput(event) {
      let ele = this.productScan.split("-").join("");
      if (ele.length == 8) {
        event.preventDefault(); //stop character from entering input
      }
      if (event.which != 9 && isNaN(String.fromCharCode(event.which))) {
        event.preventDefault(); //stop character from entering input
      }
    },
  },

  created() {
    console.log("loccc", this.loc);
  },

  computed: {},
};
</script>

<style scoped>
.order {
  padding: 5px 30px;
  margin-top: 50px;
  margin-bottom: 50px;
  background: #f8f8f8;
}
</style>
