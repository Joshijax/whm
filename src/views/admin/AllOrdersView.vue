<!-- *************************
	TEMPLATE
	************************* -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 style="color: white">All orders</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="orders"
            :search="search"
            fixed-header
            height="400px"
          >
            <template v-slot:[`item.product_image_url`]="{ item }">
              <img
                :src="item.product_image_url"
                style="width: 50px; height: 50px"
              />
            </template>
            <template v-slot:[`item.shipping_status`]="{ item }">
              <v-chip :color="getColor(item.shipping_status)" dark>
                {{ item.shipping_status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- *************************
	SCRIPT
	************************* -->

<script>
import adminHeader from "@/components/admin/adminHeader";
import axios from "axios";
export default {
  name: "Home",

  components: {
    adminHeader,
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Ref", value: "id", filterable: true },
        {
          text: "Client Name",
          align: "start",
          filterable: true,
          value: "full_name",
        },
        { text: "Phone", value: "phone", filterable: true },
        { text: "Email", value: "email", filterable: true },
        { text: "Status", value: "shipping_status" },
        { text: "total", value: "paid_amount" },
        { text: "Date", value: "date_created" },
      ],
      orders: [],
    };
  },
  methods: {
    async getOrders() {
      console.log(process.env.VUE_APP_API);
      let orders = await axios.get(`${process.env.VUE_APP_API}/orders`);
      console.log(orders.data);
      this.orders = orders.data;
    },
    getColor(status) {
      if (status === "new order") return "orange";
      else if (status === "shipped") return "green";
      else if (status === "canceled") return "red";
      else if (status === "in_process") return "blue";
      else if (status === "in_picking") return "grey";
      else if (status === "in_packing") return "grey";
      else return "blue";
    },
  },
  async created() {
    await this.getOrders();
  },
};
</script>

<!-- *************************
	STYLE
	************************* -->

<style scoped lang="scss">
.white-panel {
  padding: 15px 10px;
  min-height: 130px;
  p {
    color: #333333;
    font-size: 12px;
    margin-bottom: 0;
  }
}
</style>
