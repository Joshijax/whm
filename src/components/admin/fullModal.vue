<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-Right-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('closer')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Product info</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="$emit('closer')"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader></v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle
                ><v-img
                  lazy-src="https://picsum.photos/id/11/10/6"
                  max-height="400"
                  max-width="400"
                  :src="item.product_image_url"
                ></v-img
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Category Name</v-list-item-title>
              <v-list-item-subtitle>{{
                item.category_name
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>More info</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>SKU</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.sku }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>EAN</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.ean }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Price</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.price_net }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Date Created</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.date_created }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Date Modified</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.date_modified }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Visibility</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.visibility }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>is_stock</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.is_stock }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>total sales</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.total_sales }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Total unit sold</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.total_units_sold }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Total view</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.total_views }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Warehouse</v-list-item-title>
              <v-list-item-subtitle
                ><h3>{{ item.warehouse[0].name }}</h3></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "fullModal",
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
    };
  },
  props: ["dialog", "item"],
};
</script>
