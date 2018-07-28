<template>
	<div id="app">
		<v-app>

			<!-- Side Menu (Mobile) -->
			<v-navigation-drawer v-model="drawer" clipped absolute temporary>

				<v-list class="pa-1">
					<v-list-tile avatar v-if="user">
						<v-list-tile-avatar>
							<img src="https://randomuser.me/api/portraits/men/85.jpg">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title v-if="user">{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>

				<v-list class="pt-0">
					<v-divider></v-divider>

					<v-list-tile v-for="(item, index) in menuItems" :key="item.title" v-if="(index === 1 && !user) || index !== 1" :to="(item.link)" exact>
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content >
							<v-list-tile-title>{{ item.title }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-list-group v-if="user" prepend-icon="account_circle" value="true">
						<v-list-tile slot="activator">
							<v-list-tile-title>{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
						</v-list-tile>
						<v-list-tile v-for="(subItem, idx) in userSubItems" :key="idx" :to="subItem.link" exact>
							<v-list-tile-title v-text="subItem.title"></v-list-tile-title>
							<v-list-tile-action>
								<v-icon v-text="subItem.icon"></v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list-group>

				</v-list>
			</v-navigation-drawer>

			<!-- Top Menu Toolbar -->
			<v-toolbar>
				<v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer">
				</v-toolbar-side-icon>
				<v-toolbar-title>Jeste</v-toolbar-title>
				<v-spacer class="hidden-xs-only"></v-spacer>
				<v-flex mx-1>
					<v-text-field v-model="searchValue" @keyup.enter.native="search" hide-details append-icon="search" @click:append="search" placeholder="Search" clearable>
					</v-text-field>
				</v-flex>
				<!-- Top Menu Links -->
				<v-toolbar-items class="hidden-xs-only">
					<v-menu open-on-hover bottom offset-y v-for="(item, index) in menuItems" :key="index">
						<v-btn flat slot="activator" :to="(item.link)">
							{{ item.title }}
						</v-btn>
						<v-list v-if="user && index === 1">
							<v-list-tile v-for="(subItem, index) in userSubItems" :key="index" :to="subItem.link" exact>
								<v-list-tile-title>{{subItem.title}}</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>
				</v-toolbar-items>
			</v-toolbar>

			<transition name="moveInUp">
				<router-view/>
			</transition>

		</v-app>
	</div>
</template>

<script>
import { USER_CHECK_LOGIN, USER_CONNECTED } from '@/modules/UserModule';

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
      menuItems: [
        { title: "Home", icon: "home", link: "/" },
        { title: "Login", icon: "swap_horizontal_circle", link: "/login" },
        { title: "About", icon: "info", link: "about" }
      ],
      userSubItems: [
        { title: "Profile", icon: "account_circle", link: "/user/" },
        { title: "Settings", icon: "settings", link: "/user/settings" },
        { title: "Logout", icon: "exit_to_app", link: "/login" }
      ],
      searchValue: ''
    };
  },
  computed: {
    user() {
      return this.$store.getters[USER_CONNECTED];
    }
  },
  methods: {
    loadUser() {
      this.$store.dispatch(USER_CHECK_LOGIN).catch(err => console.log(err));
    },
    pushToLink(link) {
      this.$router.push(link);
    },
    search() {
      console.log("search", this.searchValue);
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.menuItems[1].title =
          this.user.details.firstName + " " + this.user.details.lastName;
        this.menuItems[1].icon = "account_circle";
      } else {
        this.menuItems[1].title = "Login";
        this.menuItems[1].icon = "swap_horizontal_circle";
      }
    }
  }
};
</script>

<style lang="scss">
.v-toolbar__title:not(:first-child) {
	margin: 0 5px !important;
}
// #app {
//   font-family: "Avenir", Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
// #nav {
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }

.moveInUp-enter-active {
  // transition: all 0.4s ease;
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.moveInUp-leave-active {
  transition: all 0.3s ease;
  // transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.moveInUp-enter,
.moveInUp-leave-to {
	position: absolute;
	top: 64px;
}
.moveInUp-enter {
  transform: translateX(100%);
}
.moveInUp-leave-to {
  transform: translateY(100%);
  // transform: translateX(-1000px);
  opacity: 0;
}
</style>