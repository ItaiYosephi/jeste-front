<template>
  <div id="app">
    <v-app>
      <v-toolbar>
            <v-toolbar-side-icon 
              class="hidden-sm-and-up"
              @click.stop="drawer = !drawer">
            </v-toolbar-side-icon>
            <v-toolbar-title>Jeste</v-toolbar-title>
			      <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
              <v-btn flat v-for="item in items" :key="item.title" @click="pushToLink(item.link)">
                {{item.title}}
              </v-btn>
    		    </v-toolbar-items>
      </v-toolbar>

      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary>
        <v-list class="pa-1">
          <v-list-tile avatar v-if="user">
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content >
              <v-list-tile-title v-if="user">{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile
            v-for="item in items"
            :key="item.title"
            @click="pushToLink(item.link)">
            <v-list-tile-action @click="">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

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
  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "home", link: "/" },
        { title: "Login", icon: "swap_horizontal_circle", link: "/login" },
        { title: "About", icon: "info", link: "about" }
      ]
    };
  },
  methods: {
    loadUser() {
      this.$store
        .dispatch(USER_CHECK_LOGIN)
        .then(user => {
          console.log(`Hi ${user.details}`);
        })
        .catch(err => console.log(err));
    },
    pushToLink(link) {
      this.$router.push(link);
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
