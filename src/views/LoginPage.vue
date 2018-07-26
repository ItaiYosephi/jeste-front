<template>
    <section class="login">
        <form @submit="login">
            <input type="text" v-model="user.email">
            <input type="password" v-model="user.password">
			<button>Login</button>
        </form>
        

    </section>

</template>

<script>
import {USER_LOGIN} from '@/modules/UserModule'
export default {
    data() {
		return {
			user: {
				email: '',
				password: ''
			}
		}

	},
	login() {
		this.$store.dispatch({type: USER_LOGIN, user})
	}

}
</script>

<style>

</style>
