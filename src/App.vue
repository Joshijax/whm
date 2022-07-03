<!-- *************************************************************************
	TEMPLATE
	************************************************************************* -->
<template>
  <v-app id="inspire">
    <!--  -->

    <component :is="this.switchHeader.header"></component>
    <v-main>
      <router-view />
    </v-main>
    <component :is="this.switchHeader.footer"></component>
  </v-app>
</template>
<!-- *************************************************************************
	SCRIPT
	************************************************************************* -->
<script>
import styles from "@/assets/css/core.css";
import HeaderComp from "@/components/whm/HeaderComp";
import Navbar from "@/components/admin/Navbar";
import FooterComp from "@/components/whm/FooterComp";
import adminHeader from "@/components/admin/adminHeader";

export default {
  components: {
    HeaderComp,
    FooterComp,
    adminHeader,
    Navbar,
  },
  data() {
    return {
      adminPage: false,
      drawer: null,
    };
  },
  mounted() {
    console.log("mounted");
  },
  beforeCreate() {
    if (window.location.pathname.includes("admin")) {
      this.adminPage = true;
    } else {
      this.adminPage = false;
    }
    console.log(window.location.pathname, "this is before created");
  },

  beforeMount() {
    console.log("before mount");
  },
  created() {
    if (window.location.pathname.includes("admin")) {
      this.adminPage = true;
    } else {
      this.adminPage = false;
    }
    console.log("app created", this.adminPage);
  },

  updated() {
    if (window.location.pathname.includes("admin")) {
      this.adminPage = true;
    } else {
      this.adminPage = false;
    }
  },

  computed: {
    switchHeader() {
      return this.adminPage
        ? {
            header: Navbar,
            footer: FooterComp,
          }
        : {
            header: HeaderComp,
            footer: FooterComp,
          };
    },
  },
};
</script>
