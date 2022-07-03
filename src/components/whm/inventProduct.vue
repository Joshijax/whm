<template>
  <v-card class="mt-5 pa-3" style="display: flex">
    <v-img height="150" width="150" :src="item.product_image_url"></v-img>

    <v-card-text>
      <v-hover open-delay="200">
        <v-btn
          style="position: absolute; right: 10px"
          class="py-4 px-0"
          x-small
          @click="restart()"
        >
          <v-icon color="red" dark> mdi-restart </v-icon>
        </v-btn>
      </v-hover>

      <div class="my-4 text-subtitle-1">
        {{ item.name }}
      </div>

      <div>product id: {{ item.sku }}</div>

      <v-progress-linear :color="barColor" :value="percent" height="25">
        <strong>{{ item.progress }}/{{ item.local_quantity }}</strong>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "inventProduct",
  data() {
    return {
      progress: 0,
    };
  },
  props: ["item"],

  methods: {
    restart() {
      if (confirm("Do you want to restart?")) {
        this.$emit("restart", this.item.id);
      }
    },
  },

  computed: {
    percent() {
      var progress = (this.item.progress / this.item.local_quantity) * 100;
      return progress;
    },

    barColor() {
      // var progress = (this.item.progress / this.item.local_quantity) * 100;
      // return progress;
      if (this.item.progress > this.item.local_quantity) {
        return "orange";
      } else if (this.item.progress < this.item.local_quantity) {
        return "blue";
      } else if (this.item.progress === this.item.local_quantity) {
        return "green";
      } else {
        return "grey";
      }
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
