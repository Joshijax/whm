<!-- *************************
	TEMPLATE
	************************* -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 style="color: white">Reception</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-dialog
          persistent
          v-if="editdialog"
          v-model="editdialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit Stock</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedStock"
                      label="Stock"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="loading"
                color="blue darken-1"
                text
                @click="editdialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                :loading="loading"
                color="blue darken-1"
                text
                @click="saveStock"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
          >
            <template v-slot:[`item.product_image_url`]="{ item }">
              <img
                :src="item.product_image_url"
                style="width: 50px; height: 50px"
              />
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>

              <v-icon small class="mr-2" @click="handleClick(item)">
                mdi-wrench
              </v-icon>
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
      editdialog: false,
      editedId: "",
      loading: false,
      item: "",
      editedStock: "",
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
        { text: "Stock", value: "stock" },
        { text: "Status", value: "status" },

        { text: "Actions", value: "actions", sortable: false },
      ],
      products: [],
    };
  },
  methods: {
    async getProducts() {
      let product = await axios.get(`${process.env.VUE_APP_API}/product/`);
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
    editItem(value) {
      console.log(value);
      this.editdialog = true;
      this.editedStock = value.stock;
      this.editedId = value.id;
    },
    async saveStock() {
      this.loading = true;
      console.log(this.editedStock, "stock");

      let product = await axios.patch(
        `${process.env.VUE_APP_API}/product/${this.editedId}/`,
        { stock: this.editedStock },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(product);

      let fill = this.products.map((item) =>
        item.id === product.data.id
          ? { ...item, stock: this.editedStock }
          : item
      );

      this.products = fill;

      console.log(fill, "updatedddd");
      this.loading = false;
      this.editdialog = false;
    },
  },
  async created() {
    await this.getProducts();
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
