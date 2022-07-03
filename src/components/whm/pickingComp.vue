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
            @keyup="addHyphen"
            @keypress="stopInput"
          ></v-text-field>

          <v-btn class="blue darken-2 white--text mt-5" @click="onSubmit">
            Search
          </v-btn>
        </v-form>

        <div :key="item.id" v-for="item in theBox.items">
          <productComp :item="item" />
        </div>

        <div
          style="justify-content: space-between; font-size: 20px"
          class="w-100 d-flex justify-content-space-between"
        >
          <v-btn class="orange darken-2 white--text mt-5"
            >I have an issue</v-btn
          >
          <v-btn
            @click="$emit('finishOrder')"
            class="green darken-2 white--text mt-5"
            :disabled="finisher"
            >Finish Order</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import productComp from "./productComp.vue";
export default {
  name: "pickingComp",

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
    productComp,
  },
  props: ["theBox", "finisher"],

  methods: {
    async onSubmit() {
      this.$refs.form.validate();
      let val = this.productScan.split("-").join("");
      console.log(val);

      this.$emit("scanProduct", val);

      this.productScan = "";
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
    console.log(this.theBox.items, "the component box");
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
