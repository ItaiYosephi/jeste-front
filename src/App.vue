<template>
  <div id="app">
    <v-app>
    <div id="nav">

      <v-toolbar>
            <v-toolbar-side-icon ></v-toolbar-side-icon>
            <v-toolbar-title>Jeste</v-toolbar-title>
			<v-spacer></v-spacer>

            <v-toolbar-items class="hidden-xs-and-down">
				<v-btn flat><router-link to="/">Home</router-link></v-btn>
				<v-btn flat><router-link to="/about">About</router-link></v-btn>
				<v-btn flat><router-link to="/login">Login</router-link></v-btn>
    		</v-toolbar-items>


      </v-toolbar>
 
	  
    </div>
    User is: {{user}}
    <router-view/>
    </v-app>
  </div>
</template>

<script>
import { USER_CHECK_LOGIN, USER_CONNECTED } from "@/modules/UserModule";

export default {
  name: "app",
  created() {
    console.log("--- Jeste App ---");
    if (!this.$store.getters.USER_CONNECTED) {
      this.loadUser();
    }
  },
  methods: {
    loadUser() {
      this.$store
        .dispatch(USER_CHECK_LOGIN)
        .then(user => {
          console.log(`Hi ${user.details}`);
        })
        .catch(err => console.log(err));
    }
  },
  computed: {
    user() {
      return this.$store.getters[USER_CONNECTED];
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
// #nav {
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
