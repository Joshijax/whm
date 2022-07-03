<!-- *************************
	TEMPLATE
	************************* -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 style="color: white">All products</h1>
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
            :items="products"
            :search="search"
            fixed-header
            height="400px"
            @click:row="handleClick"
          >
            <template v-slot:[`item.product_image_url`]="{ item }">
              <img
                :src="item.product_image_url"
                style="width: 50px; height: 50px"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <fullModal
        v-if="dialog"
        :dialog="dialog"
        :item="item"
        @closer="closeModal"
      />
    </v-row>
  </v-container>
</template>
<!-- *************************
	SCRIPT
	************************* -->

<script>
import adminHeader from "@/components/admin/adminHeader";
import fullModal from "@/components/admin/fullModal.vue";
import axios from "axios";
export default {
  name: "AllOrdersView",

  components: {
    adminHeader,
    fullModal,
  },
  data() {
    return {
      search: "",
      dialog: false,
      item: "",
      headers: [
        { text: "Images", value: "product_image_url" },
        { text: "ID", value: "id" },
        {
          text: "Product",
          align: "start",
          filterable: true,
          value: "name",
        },
        { text: "EAN", value: "ean", filterable: true },
        { text: "SKU", value: "sku" },
        { text: "Status", value: "status" },
        { text: "Location", value: "location" },
      ],
      products: [],
    };
  },
  methods: {
    async getProducts() {
      let product = await axios.get(`http://127.0.0.1:8000/product/`);
      console.log(product.data);
      this.products = product.data;
    },
    closeModal() {
      this.item = "";
      this.dialog = false;
    },
    handleClick(value) {
      console.log(value);
      // this.$router.push(`${window.location.pathname}/${value.id}`);
      this.item = value;
      this.dialog = true;
    },
  },
  async created() {
    await this.getProducts();

    // if (sessionStorage.getItem("key") === null) {
    //   // this.$router.push("/login");
    //   window.location = "/login";
    // }
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
tr:hover {
  cursor: pointer !important;
}
</style>
