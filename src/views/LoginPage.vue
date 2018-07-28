<template>
        <section class="login">
            <v-form @submit.prevent="login" v-model="valid" ref="form">
                <v-text-field 
                  v-model="user.email"
                  :rules="emailRules"
                  label="Email"
                  required>
                </v-text-field>
                <v-text-field type="password" v-model="user.password"></v-text-field>
          <v-btn type="submit" :disabled="!valid">Login</v-btn>

            </v-form>
          <v-btn @click="logout">Logout</v-btn>
            

        </section>
</template>

<script>
import { USER_LOGIN, USER_LOGOUT } from '@/modules/UserModule';
export default {
	data() {
		return {
			valid: true,
			user: {
				email: '',
				password: ''
			},
			emailRules: [
				v => !!v || 'E-mail is required',
				v => /.+@.+/.test(v) || 'E-mail must be valid'
			]
		};
	},
	methods: {
		login() {
			if (this.$refs.form.validate()) {
				this.$store
					.dispatch({ type: USER_LOGIN, user: this.user })
					.then(_ => {
						// TODO: ADD SUCSSESS MESSAGE
						console.log(_);
						this.$router.push('/');
					})
					.catch(err => {
						// TODO: ADD error MESSAGE
						console.log(err);
					});
			}
		},
		logout() {
			this.$store
				.dispatch(USER_LOGOUT)
				.then(_ => console.log('logged out successfuly'));
		}
	}
};
</script>

<style lang="scss" scoped>
</style>