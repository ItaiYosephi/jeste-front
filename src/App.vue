<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import {USER_CHECK_LOGIN, USER_CONNECTED} from '@/modules/UserModule'

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
      this.$store.dispatch(USER_CHECK_LOGIN).then(user => console.log(`Hi ${user}`));
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
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
