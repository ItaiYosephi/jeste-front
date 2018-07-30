<template>
        <v-layout align-center justify-center>
          <v-flex class="wrapper">
			<v-card grow>
				<v-toolbar color="primary" class="white--text">
					<v-toolbar-title >Login</v-toolbar-title>
				</v-toolbar>
				<v-form @submit.prevent="login" v-model="valid" ref="form">
					<v-card-text>
						<v-text-field 
							v-model="user.email"
							label="E-mail"
							:rules="emailRules"
							hint="Insert a valid E-mail"
							required>
						</v-text-field>
						<v-text-field 
							v-model="user.password"
							label="Password"
							:rules="passwordRules"
							:type="show ? 'text' : 'password'"
            				:append-icon="show ? 'visibility_off' : 'visibility'"
							@click:append="show = !show"
							hint="At least 8 characters"
							required>
						</v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" type="submit" :disabled="!valid" ripple>Login</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { USER_LOGIN, USER_LOGOUT, USER_CONNECTED } from "@/modules/UserModule";

export default {
  data() {
    return {
      valid: true,
      user: {
        email: "",
        password: ""
	  },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
	  ],
	  show: false,
	  passwordRules: [
		  v => !!v || "Password is required"
	  ]
    };
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch({ type: USER_LOGIN, user: this.user })
          .then(user => {
            EventBus.$emit(SNACK_MSG, {
              text: `Welcome back ${user.details.firstName}`,
              bgColor: "success"
            });
            this.$router.push("/");
          })
          .catch(err => {
            // TODO: ADD error MESSAGE
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 100%;
	max-width: 800px;
}
</style>