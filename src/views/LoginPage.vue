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
          // TODO: ADD SUCSSESS MESSAGE
          console.log(_);
          this.$router.push("/");
        })
        .catch(err => {
          // TODO: ADD error MESSAGE
          console.log(err);
        });
    },
    logout() {
      this.$store.dispatch(USER_LOGOUT)
        .then(_ => console.log("logged out successfuly"));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>