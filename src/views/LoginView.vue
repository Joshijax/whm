<template>
  <v-container fluid>
    <center>
      <v-card class="justify-space-around ma-10 pa-8" width="300" height="400">
        <v-form @submit.prevent="onSubmit" ref="form">
          <v-row>
            <v-col cols="12" class="px-4">
              <img
                alt="Vue logo"
                src="../assets/logo.png"
                style="max-height: 50px"
                class="mt-4 mb-6"
              />
            </v-col>
            <v-col cols="12" class="px-4 mb-3">
              <v-text-field
                solo
                required
                name="username"
                v-model="username"
                id="scanBarcode"
                :rules="rules"
                placeholder="Enter username"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="px-4 mb-3">
              <v-text-field
                solo
                required
                name="passwrod"
                v-model="password"
                id="scanBarcode"
                :rules="passwordrules"
                placeholder="Enter password"
                type="password"
              ></v-text-field>
            </v-col>
          </v-row>
          <center>
            <v-btn
              type="submit"
              color="secondary"
              class="amber darken-2 pa-4"
              :loading="isLoading"
              @click="onSubmit"
              >Login</v-btn
            >
          </center>
        </v-form>
      </v-card>
    </center>

    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import Vue from "vue";
import axios from "axios";
export default {
  name: "LoginView",

  data() {
    return {
      snackbar: false,
      text: ``,
      username: "",
      password: "",
      isLoading: false,
      rules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      passwordrules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 5) || "Min 5 characters",
      ],
    };
  },

  created() {},

  methods: {
    async login() {
      let self = this;
      let detail = {
        username: this.username,
        password: this.password,
      };
      this.isLoading = true;
      let api = `${process.env.VUE_APP_API}/rest-auth/login/`;

      axios
        .post(api, detail)
        .then((response) => {
          console.log(response.data);
          this.text = response.data;
          const data = axios.get(`${process.env.VUE_APP_API}/rest-auth/user/`, {
            headers: {
              Authorization: `token ${token}`,
            },
          });
          console.log(data, "expectedddd");
          sessionStorage.setItem("key", response.data.key);
          this.snackbar = true;
          this.isLoading = false;
          this.$router.push("/admin/home");
          // window.location = "/admin";
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data, "thisss");
            console.log(error.response.status);
            console.log(error.response.headers);
            this.isLoading = false;
            if (error.response.data.non_field_errors) {
              var inErrors = [];
              inErrors = error.response.data.non_field_errors;
              inErrors.forEach((element) => {
                this.text = element;
                this.snackbar = true;
              });
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },

    onSubmit() {
      if (this.$refs.form.validate()) {
        this.login();
      }
    },
  },
};
</script>
