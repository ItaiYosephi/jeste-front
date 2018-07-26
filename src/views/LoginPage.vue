<template>
    <section class="login">
        <form @submit.prevent="login">
            <input type="text" v-model="user.email">
            <input type="password" v-model="user.password">
			<button>Login</button>

        </form>
			<button @click="logout">Logout</button>
        

    </section>

</template>

<script>
import { USER_LOGIN, USER_LOGOUT } from "@/modules/UserModule";
export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch({ type: USER_LOGIN, user: this.user })
        .then(_ => {
          //TODO: ADD SUCSSESS MESSAGE
          console.log(_);

          this.$router.push("/");
        })
        .catch(_ => {
          //TODO: ADD error MESSAGE
          console.log('faild log in');

        });
    },
    logout() {
      this.$store.dispatch({ type: USER_LOGOUT });
    }
  }
};
</script>

<style>
</style>
