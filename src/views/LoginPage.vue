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
import { EventBus, SNACK_MSG} from '@/services/EventBusService'
import { USER_LOGIN, USER_LOGOUT, USER_CONNECTED } from '@/modules/UserModule';

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
				this.$store.dispatch({ type: USER_LOGIN, user: this.user })
					.then(user => {
						EventBus.$emit(SNACK_MSG, {text: `Welcome back ${user.details.firstName}`, bgColor: 'success'})
						this.$router.push('/');
					})
					.catch(err => {
						// TODO: ADD error MESSAGE
						console.log(err);
					});
			}
		},
		logout() {
			let fName = this.$store.getters[USER_CONNECTED].details.firstName;
			this.$store.dispatch(USER_LOGOUT)
				.then(_ => {
					EventBus.$emit(SNACK_MSG, {text: `Bey ${fName}`, bgColor: 'info'})
					console.log('Logged out successfuly')
				});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>