<template>
  <div>
    <v-app-bar app color="#00465A">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        style="color: #ffffff"
      ></v-app-bar-nav-icon>

      <v-toolbar-title style="color: #ffffff">WHM</v-toolbar-title>
    </v-app-bar>
    <div class="row"></div>
  </div>
</template>

<script>
export default {
  name: "HeaderComp",
  data() {
    return {};
  },
};
</script>
<!-- *************************************************************************
	STYLE
	************************************************************************* -->
<style lang="scss" scoped></style>
