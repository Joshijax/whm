<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="order">
        <p>Associate the product:</p>
        <v-form ref="form" v-on:submit.prevent="onSubmit">
          <label for="scanBarcode">Scan location: {{ product.label }}</label>
          <v-text-field
            solo
            v-model="locationScan"
            placeholder="Scan or type the location manually..."
            :rules="rules"
            @keyup="addHyphen"
            @keypress="stopInput"
          ></v-text-field>

          <v-btn class="blue darken-2 white--text mt-5" @click="onSubmit">
            Search
          </v-btn>
        </v-form>

        <div>Location :{{ product.label }}</div>

        <div
          style="justify-content: space-between; font-size: 20px"
          class="w-100 d-flex justify-content-space-between"
        >
          <v-btn class="orange darken-2 white--text mt-5"
            >I have an issue</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import productComp from "./productComp.vue";
export default {
  name: "assComp",

  data() {
    return {
      valid: true,

      locationScan: "",
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
    };
  },
  components: {
    productComp,
  },
  props: ["product"],

  methods: {
    async onSubmit() {
      console.log("Submit started");
      this.$refs.form.validate();
      console.log("Validated");

      if (this.locationScan === this.product.label) {
        let val = this.locationScan.split("-").join("");
        console.log(val);
        this.$emit("scanProduct", val);
        this.locationScan = "";
        this.$emit("reset");
      } else {
        alert("Please scan the correct location");
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

  created() {
    //     let fill = this.theBox.items.filter((item)=> item.product_sku=== '00000258' )
    //     let fill1 = this.theBox.items.map((item)=> item.product_sku=== '00000258'
    //   ? {...item, progress: item.progress+1 } : item)
    //     let test = {...this.theBox, items: fill1}
    // console.log(this.theBox.items, 'this packing created', fill)
    // console.log(fill1, 'this packing2')
    // console.log('this the test box', test)
    // var lineItems = []
    // var vall = 0
    // lineItems = this.theBox.items
    // lineItems.forEach(element => {
    //     vall = element.progress + vall
    //     console.log(vall)
    //   });
  },

  computed: {},

  mounted() {
    console.log("assoc", this.product);
  },
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
