<template>
  <v-card grow>
      <v-toolbar color="primary" class="white--text" flat>
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-form @submit.prevent="login" v-model="validLogin" ref="formLogin">
        <v-card-text>
          <v-text-field browser-autocomplete="email" box v-model="user.email" type="email" label="E-mail" :rules="emailRules" hint="Insert a valid E-mail" required>
          </v-text-field>
          <v-text-field browser-autocomplete="current-password" box v-model="user.password" label="Password" :rules="passwordRules" :type="show ? 'text' : 'password'" :append-icon="show ? 'visibility_off' : 'visibility'"
            @click:append="show = !show" hint="At least 8 characters" required>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :disabled="!validLogin" ripple>Login</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
</template>

<script>
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { USER_LOGIN, USER_LOGOUT, USER_CONNECTED } from "@/modules/UserModule";

export default {
  name: "login",
  data() {
    return {
      // Login
      validLogin: true,
      user: { email: "", password: "" },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "Please enter a valid email"
      ],
      show: false,
      passwordRules: [v => !!v || "Password is required"]
    };
  },
  methods: {
    login() {
      if (this.$refs.formLogin.validate()) {
        this.$store
          .dispatch({ type: USER_LOGIN, user: this.user })
          .then(user => {
            this.$socket.emit('userLogged', {
						userId: user._id});
            EventBus.$emit(SNACK_MSG, {
              text: `Welcome back ${user.details.firstName}`,
              bgColor: "success"
            });
            this.$router.push("/");
          })
          .catch(err => {
            EventBus.$emit(SNACK_MSG, {
              text: `Error, Could'nt sign up`,
              bgColor: "error"
            });
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" >
/* Change Autocomplete styles in Chrome*/
input:-webkit-autofill,
input:-webkit-autofill:focus
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  // border: 1px solid green !important;
  // -webkit-text-fill-color: green !important;
  -webkit-box-shadow: 0 0 0px 1000px #f0f0f0 inset !important;
  // transition: background-color 5000s ease-in-out 0s !important;
}


</style>