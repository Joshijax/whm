<template>
  <v-card class="mt-5 pa-3" style="display: flex">
    <v-img height="150" width="150" :src="item.product_image_url"></v-img>

    <v-card-text>
      <div class="my-4 text-subtitle-1">
        {{ item.product_name }}
      </div>

      <div>Location: {{ item.warehouses.label }}</div>
      <div>product id: {{ item.product_id }}</div>

      <v-progress-linear :value="percent" height="25">
        <strong>{{ item.progress }}/{{ item.quantity }}</strong>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "productComp",
  data() {
    return {
      knowledge: 30,
    };
  },
  props: ["item"],

  computed: {
    percent() {
      var progress = (this.item.progress / this.item.quantity) * 100;
      return progress;
    },

    // addHyphen(){
    //     if (this.item.product_sku !== '' || null) {
    //     let ele = this.item.product_sku.split('-').join('');
    //     let finalVal = ele.match(/.{1,2}/g).join('-');
    //     this.productScan = finalVal
    //     return finalVal
    //     }
    // }

    // percent: () =>{
    // //   var progress = this.item.progress/this.item.quantity * 100;
    //   return this.item.quantity;
    // }
  },
};
</script>

<style></style>
