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
            <label for="scanBarcode">Scan a packing box:</label>
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
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
    };
  },

  components: {
    dialoger,
    PickingComp,
  },

  methods: {
    async finishOrder() {
      console.log("this is finished");
      // update box status to packing
      axios.patch(`api/boxes/${this.mainBox.id}`, {
        status: null,
        order: null,
        items: [],
      });

      // update box status to in_packing
      axios.patch(`api/orders/${this.mainBox.order}`, {
        shipping_status: "shipped",
      });

      // alert("order has been completed, scan another box");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },

    async scanProduct(val) {
      let fill = this.mainBox.items.map((item) =>
        item.product_id === val && item.progress < item.quantity
          ? { ...item, progress: item.progress + 1 }
          : item
      );

      console.log(fill);

      let upBox = await axios.patch(`api/boxes/${this.mainBox.id}`, {
        items: fill,
      });

      this.mainBox = upBox.data;
    },

    async continueBox(id) {
      console.log("this is the id", id);
      this.dialog = false;
      const mainBox = await axios.get(`api/boxes/${id}`);
      console.log(mainBox.data, "continueBox");

      if (mainBox.data.status === "packing") {
        this.mainBox = mainBox.data;

        this.showPicking = true;
      } else if (mainBox.data.status === "picking") {
        alert("order still in picking");
        window.location.reload();
      }

      // display the box
    },

    async checkBox() {
      const res = await axios.get(
        `api/boxes?box_label=${this.scanBox.toUpperCase()}`
      );

      console.log(res.data);
      if (res.data.length !== 0) {
        if (res.data[0].status === "packing") {
          this.order = res.data[0].order;
          // display the box in my code
          this.mainBoxId = res.data[0].id;
          this.message = `This box has an order ${this.order},
          Scan another box or complete packing`;
          this.messageTitle = `${this.scanBox.toUpperCase()} packing not completed`;
          this.dialog = true;
        } else {
          alert(`${this.scanBox.toUpperCase()} not in  packing`);
        }
      } else {
        alert(`${this.scanBox.toUpperCase()} doesn't exist`);
      }
    },

    onSubmit() {
      if (this.$refs.form.validate()) {
        console.log(this.scanBox);
        this.checkBox();
      }
    },
  },

  computed: {
    finisher: function () {
      var val = true;

      if (this.showPicking) {
        var lineItems = [];
        var valProgress = 0;
        var valQuantity = 0;

        lineItems = this.mainBox.items;

        lineItems.forEach((element) => {
          valProgress = element.progress + valProgress;
          valQuantity = element.quantity + valQuantity;
        });

        if (valProgress === valQuantity) {
          val = false;

          axios.patch(`api/boxes/${this.mainBox.id}`, {
            status: null,
            order: null,
            items: [],
          });

          // update box status to in_packing
          axios.patch(`api/orders/${this.mainBox.order}`, {
            shipping_status: "shipped",
          });

          setTimeout(() => {
            window.location.reload();
          }, 3000);
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
.v-application {
  background-color: #044157 !important;
}
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
