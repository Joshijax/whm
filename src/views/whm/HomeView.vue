<!-- *************************************************************************
	TEMPLATE
	************************************************************************* -->
<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <router-link to="/picking">
          <v-card class="white-panel mx-auto d-flex flex-column align-center justify-center text-center">
            <b>Picking</b>
            <p>Start picking products for your orders</p>
          </v-card>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link to="/packing">
          <v-card class="white-panel mx-auto d-flex flex-column align-center justify-center text-center">
            <b>Packing</b>
            <p>Prepare orders for shipping</p>
          </v-card>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link to="/association">
          <v-card class="white-panel mx-auto d-flex flex-column align-center justify-center text-center">
            <b>Association</b>
            <p>Scan products and put them on their location</p>
          </v-card>
        </router-link>
      </v-col>
      <v-col cols="6">
        <router-link to="/inventory">
          <v-card class="white-panel mx-auto d-flex flex-column align-center justify-center text-center" >
            <b>Inventory</b>
            <p>Scan a location and verify the products</p>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- *************************************************************************
	SCRIPT
	************************************************************************* -->

<script>


  export default {
    name: 'Home',

    components: {

    },
  }
</script>

<!-- *************************************************************************
	STYLE
	************************************************************************* -->

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
