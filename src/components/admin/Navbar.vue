<template>
  <nav>
    <v-app-bar
      class="white"
      v-if="isLoading"
      flat
      app
      :class="[$mq === 'desktop' && drawer ? 'myHeader' : null]"
    >
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span class="font-weight-light">Molite</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      app
      class="white lighten-4 myNav"
      v-model="drawer"
      v-if="isLoggedIn"
    >
      <v-layout style="min-height: 100%">
        <!-- <v-flex xs4 class="indigo darken-4 pa-2 mt-6">
          <v-list>
            <v-list-item-group color="indigo darken-4">
              <v-list-item v-for="user in users" :key="user.text" router :to="user.route" class="my-5">
                <center>
                  <v-avatar
                      color="white"
                      size="44"
                  >
                    <span class="indigo--text text--darken-4 text-h4">{{ user.init }}</span>
                  </v-avatar>
                  <span class="white--text text-body-2">{{ user.text }}</span>
                </center>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-flex> -->

        <v-flex xs12>
          <v-list>
            <img
              alt="Vue logo"
              src="../../assets/logo.png"
              style="max-height: 50px"
              class="mt-4 mb-6 mainlogo"
            />
            <v-list-item-group color="amber darken-2">
              <v-list-item
                v-for="link in links"
                :key="link.text"
                router
                active-class="active"
                :to="link.route"
              >
                <v-list-item-icon>
                  <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="black--text">{{
                    link.text
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-list class="mt-16">
            <v-list-item-group color="amber darken-2">
              <v-list-item @click="logout">
                <v-list-item-content>
                  <v-list-item-title class="black--text"
                    >Logout</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>

              <v-container class="pa-4" v-if="!isLoading">
                <center>
                  <v-progress-circular
                    :size="25"
                    :width="3"
                    color="amber"
                    indeterminate
                  ></v-progress-circular>
                </center>
              </v-container>
            </v-list-item-group>
          </v-list>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "NavBar",

  data() {
    return {
      isLoggedIn: true,
      drawer: true,
      isLoading: true,
      msg: "",
      user: [],
      links: [
        {
          text: "All Products",
          route: "/admin/home",
          icon: "mdi-view-dashboard",
        },
        {
          text: "All Orders",
          route: "/admin/all-orders",
          icon: "mdi-view-dashboard",
        },
        {
          text: "Reception",
          route: "/admin/reception",
          icon: "mdi-view-dashboard",
        },

        {
          text: "Inventory Logs",
          route: "/admin/inventory-logs",
          icon: "mdi-view-dashboard",
        },
        {
          text: "User roles",
          route: "/accounts",
          icon: "mdi-view-dashboard",
        },
      ],
      users: [
        {
          text: "Admin",
          init: "Ad",
          route: "/",
        },
        {
          text: "Hr",
          init: "Hr",
          route: "/hr",
        },

        {
          text: "Realtor",
          init: "Re",
          route: "/realtor",
        },
        {
          text: "Account",
          init: "Ac",
          route: "/account",
        },
      ],
    };
  },
  created() {},
  methods: {
    logout() {
      sessionStorage.removeItem("key");
      this.$router.push("/login");
      // window.location = "/login";
    },
  },
};
</script>

<style scoped>
.v-item-group {
  text-align: center;
}
.v-item--active {
  background-color: #f9b233;
}

.active {
  background-color: #f9b233;
}
.v-list-item:hover {
  background-color: #ffbf57;
}
.mainlogo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.myHeader {
  left: 216px !important;
}

.myNav {
  width: 218px !important;
}
</style>
