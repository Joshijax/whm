<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-form
            v-if="!showInvent"
            @submit.prevent="onSubmit"
            ref="form"
            class="p-2"
          >
            <label for="scanBarcode">Scan Location:</label>
            <v-text-field
              solo
              required
              name="scanBarcode"
              :autofocus="true"
              v-model="scanLoc"
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

      <inventComp
        v-if="showInvent"
        :loc="loc"
        :finisher="finisher"
        @reset="reset"
        @scanProduct="scanProduct"
        @finishInvent="finishInvent"
        @restart="restart"
      />
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

import inventComp from "../../components/whm/inventComp.vue";
export default {
  name: "inventoryView",
  data() {
    return {
      scanLoc: "",

      showInvent: false,
      warehouseName: process.env.VUE_APP_WAREHOUSE,
      warehouses: "",
      loc: [],

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
    inventComp,
    assDialoger,
  },

  methods: {
    async restart(val) {
      console.log(val, "Got it at the end");
      let fill = this.loc.associated_products.map((item) =>
        item.id === val ? { ...item, progress: 0 } : item
      );

      console.log(fill);

      let resetProgress = await axios.patch(`api/inventlog/${this.loc.id}`, {
        associated_products: fill,
      });

      this.loc = resetProgress.data;
    },
    async finishInvent() {
      console.log("this is finished", this.finisher);
      if (this.finisher) {
        await axios.patch(`api/inventlog/${this.loc.id}`, {
          has_diff: false,
        });
        this.reset();
      } else {
        if (
          confirm(
            "There are differences in the inventory, Do you want to continue?"
          )
        ) {
          await axios.patch(`api/inventlog/${this.loc.id}`, {
            has_diff: true,
          });
          this.reset();
        }
      }
    },
    async scanProduct(val) {
      console.log("scanned product");
      let fill = this.loc.associated_products.map((item) =>
        item.sku === val ? { ...item, progress: item.progress + 1 } : item
      );

      console.log(fill);

      let upInvent = await axios.patch(`api/inventlog/${this.loc.id}`, {
        associated_products: fill,
      });

      this.loc = upInvent.data;
    },

    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
    addHyphen() {
      if (this.scanLoc !== "" || null) {
        let ele = this.scanLoc.split("-").join("");
        let finalVal = ele.match(/.{1,2}/g).join("-");
        this.scanLoc = finalVal;
        return finalVal;
      }
    },

    stopInput(event) {
      let ele = this.scanLoc.split("-").join("");
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
        console.log(this.scanLoc);
        this.checkLoc();
      }
    },
    async checkLoc() {
      const res = await axios.get(`api/locations?loc_label=${this.scanLoc}`);
      const res1 = await axios.get(`api/inventlog?loc_label=${this.scanLoc}`);
      console.log(res.data);
      let result = await res.data[0];
      //   check if the location from res1 exists
      if (res.data.length !== 0) {
        //   check if the location has a log
        if (res1.data.length === 0) {
          let lineItems = [];
          lineItems = await res.data[0].associated_products;
          //   add progress to associated_products from the location
          lineItems.forEach((element) => {
            element.progress = 0;
          });
          // create a new log
          let newLog = {
            loc_label: this.scanLoc,
            created_date: new Date().toLocaleString(),
            has_diff: true,
            associated_products: lineItems,
          };
          // post the log
          const log = await axios.post("api/inventLog", newLog);
          this.loc = log.data;

          this.showInvent = true;
          console.log("lineitems", newLog);
        } else {
          this.loc = res1.data[0];

          this.showInvent = true;
        }
      } else {
        alert("location does not exist");
      }
    },
  },
  computed: {
    finisher: function () {
      var val = false;

      if (this.showInvent) {
        var lineItems = [];
        var valProgress = 0;
        var valQuantity = 0;
        console.log("finsinsher", this.loc.associated_products);
        lineItems = this.loc.associated_products;

        lineItems.forEach((element) => {
          valProgress = element.progress + valProgress;
          valQuantity = element.local_quantity + valQuantity;
        });

        if (valProgress === valQuantity) {
          val = true;

          // alert("order has been completed, scan another box");
        }
      }

      return val;
    },
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
