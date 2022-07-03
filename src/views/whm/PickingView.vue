<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-form
            v-if="!showPicking"
            @submit.prevent="onSubmit"
            ref="form"
            class="p-2"
          >
            <label for="scanBarcode">Scan a picking box:</label>
            <v-text-field
              solo
              required
              name="scanBarcode"
              v-model="scanBox"
              id="scanBarcode"
              :rules="rules"
              placeholder="Scan or type the code manually..."
            ></v-text-field>
          </v-form>
        </v-col>
        <dialoger
          @continueBox="continueBox"
          @closer="dialog = !dialog"
          :box="scanBox"
          :dialog="dialog"
          :order="orderId"
          :mainBoxId="mainBoxId"
          :message="message"
          :title="messageTitle"
        />
      </v-row>
      <pickingComp
        v-if="showPicking"
        @scanProduct="scanProduct"
        @finishOrder="finishOrder"
        :theBox="mainBox"
        :finisher="finisher"
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
import dialoger from "../../components/whm/dialoger.vue";
import pickingComp from "../../components/whm/pickingComp.vue";
import PickingComp from "../../components/whm/pickingComp.vue";
export default {
  name: "PickingView",

  data() {
    return {
      scanBox: "",
      order: "",
      showPicking: false,
      orderId: "",
      message: "",
      messageTitle: "",
      mainBox: [],
      mainBoxId: "",
      dialog: false,
      // Rules for the input field
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length === 6) || "Min 6 characters",
        (value) =>
          (/^[0-9]*$/.test(value.slice(3)) &&
            value.slice(0, 3).toUpperCase() === "BOX") ||
          "Not a valid character - 'e.g BOX001 or box001'",
      ],
    };
  },

  // define components
  components: {
    dialoger,
    PickingComp,
  },

  methods: {
    // Method to finish order
    async finishOrder() {
      // update box status to packing
      axios.patch(`api/boxes/${this.mainBox.id}`, {
        status: "packing",
      });

      // update box status to in_packing
      axios.patch(`api/orders/${this.mainBox.order}`, {
        shipping_status: "in_packing",
      });

      // reset page to inistail state
      this.reset();
    },

    // reset page
    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
    },

    // Method scan product
    async scanProduct(val) {
      // Get item with val with product id and add one to progress
      let fill = this.mainBox.items.map((item) =>
        item.product_id === val && item.progress < item.quantity
          ? { ...item, progress: item.progress + 1 }
          : item
      );

      // Update progress of box to the server
      let upBox = await axios.patch(`api/boxes/${this.mainBox.id}`, {
        items: fill,
      });

      // update the state of the box
      this.mainBox = upBox.data;
    },

    async continueBox(id) {
      // remove dialog
      this.dialog = false;

      // Get the box with id from server
      const mainBox = await axios.get(`api/boxes/${id}`);

      // Check if box status is picking: If picking show picking component
      if (mainBox.data.status === "picking") {
        this.mainBox = mainBox.data;
        // Toggle picking component
        this.showPicking = true;
      } else if (mainBox.data.status === "packing") {
        // if box has status packing alert box is packing
        alert("order has been completed, scan another box");
        // reset page to initial state
        this.reset();
      }

      // display the box
    },

    // Check to know status of the box
    async checkBox() {
      // Get searched box from server
      const res = await axios.get(
        `api/boxes?box_label=${this.scanBox.toUpperCase()}`
      );

      // check if the box exists
      if (res.data.length !== 0) {
        // check if the box order = null: then fill box with order
        if (res.data[0].order === null) {
          this.order = res.data[0].order;
          this.mainBoxId = res.data[0].id;
          await this.fillBox();
        } else {
          // If box order not null then continue box
          this.order = res.data[0].order;
          // display the box in my code
          this.mainBoxId = res.data[0].id;

          // dialog Message content
          this.message = `This box is already associated to an order ${this.order}, <br>
          Scan another box or complete this order`;

          // dialog message Title
          this.messageTitle = `${this.scanBox.toUpperCase()} is already associated`;
          this.dialog = true;
        }
      } else {
        // If nox does not exist trigger method creat box
        await this.createBox();
      }
    },

    // method to create box
    async createBox() {
      // fetch order with status in in_process
      const orders = await axios.get("api/orders?shipping_status=in_process");
      console.log(orders.data);

      // stop creating box if there is no order with process in_process
      if (orders.data.length === 0) {
        alert("No order available");
        return;
      }

      // Fetch all first order with status in_process
      const order = await axios.patch(`api/orders/${orders.data[0].id}`, {
        shipping_status: "in_picking",
      });

      // const order = await axios.get(`api/orders/${orders.data[0].id}`);

      var lineItems = [];
      lineItems = await order.data.line_items;
      // Assign progress to each items in order
      lineItems.forEach((element) => {
        element.progress = 0;
        // make sure all product_id are 8 characters
        element.product_id = element.product_id.toString().padStart(8, "0");
      });

      // create new box and set the first order in orders to in_picking

      const newBox = {
        box_label: this.scanBox.toUpperCase(),
        order: orders.data[0].id,
        status: "picking",
        items: lineItems,
      };

      // save box using post request

      const theBox = await axios.post("api/boxes", newBox);

      // display the box

      this.mainBox = theBox.data;

      this.showPicking = true;

      // console.log(lineItems, "line items");
    },

    // Assign order to box where order is null
    async fillBox() {
      // fetch all order with status in_process
      const orders = await axios.get("api/orders?shipping_status=in_process");

      // stop creating box if there is no order with process in_process
      if (orders.data.length === 0) {
        alert("No order available");
        return;
      }

      // fetch the first order with status in_process
      const order = await axios.patch(`api/orders/${orders.data[0].id}`, {
        shipping_status: "in_picking",
      });

      var lineItems = [];
      lineItems = await order.data.line_items;

      // Assign progress to each items in order
      lineItems.forEach((element) => {
        element.progress = 0;
        // make sure all product_id are 8 characters
        element.product_id = element.product_id.toString().padStart(8, "0");
      });

      // fill the box with the order and set the first order in orders to picking

      const fillBox = {
        order: orders.data[0].id,
        status: "picking",
        items: lineItems,
      };

      // assign the box to order and make a patch request to the server
      const theBox = await axios.patch(`api/boxes/${this.mainBoxId}`, fillBox);

      // display the box

      this.mainBox = await theBox.data;

      // show picking component
      this.showPicking = true;
    },

    // Method to handle submit
    onSubmit() {
      // checking the rules of the input field are met
      if (this.$refs.form.validate()) {
        // Trigger the checkBox method
        this.checkBox();
      }
    },
  },

  computed: {
    // computter function to check if the box has been scanned completely
    finisher: function () {
      var val = true;

      // check if the picking component has been the displayed and the box has been theBox in data has bben filed
      if (this.showPicking) {
        var lineItems = [];
        var valProgress = 0;
        var valQuantity = 0;

        lineItems = this.mainBox.items;
        // Add all progress and quantity of all products
        lineItems.forEach((element) => {
          valProgress = element.progress + valProgress;
          valQuantity = element.quantity + valQuantity;
        });

        // check if the vallue of the added up progress and the value of added up quantity are equal to each other
        if (valProgress === valQuantity) {
          val = false;

          // set progress of all products to zero
          lineItems.forEach((element) => {
            element.progress = 0;
          });

          // update box status to packing
          axios.patch(`api/boxes/${this.mainBox.id}`, {
            status: "packing",
            items: lineItems,
          });

          // update box status to in_packing
          axios.patch(`api/orders/${this.mainBox.order}`, {
            shipping_status: "in_packing",
          });

          setTimeout(() => {
            this.reset();
          }, 3000);

          // alert("order has been completed, scan another box");
        }
      }

      return val;
    },
  },
};
</script>

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
