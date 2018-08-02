<template>
  <div id="app">
    <v-app>
      <!-- Side Menu (Mobile) -->
      <v-navigation-drawer app v-model="drawer" fixed temporary>

				<v-list class="pa-1">
					<v-list-tile avatar v-if="user">
						<v-list-tile-avatar>
							<img :src="user.img.url">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title v-if="user">{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>

				<v-list class="pt-0">
					<v-divider></v-divider>
					<v-list-tile v-for="(item, index) in menuItems" :key="item.title" v-if="(index === 2 && !user) || index !== 2" :to="(item.link)" exact>
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ item.title }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

          <v-list-group v-if="user" prepend-icon="account_circle" value="true">
            <v-list-tile slot="activator">
              <v-list-tile-title>{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :to="`/user/${user._id}`" excat>
              <v-list-tile-title>Profile</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>account_circle</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile to="/user/settings" excat>
              <v-list-tile-title>Settings</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>settings</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile @click="logout">
              <v-list-tile-title>Logout</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>

        </v-list>
      </v-navigation-drawer>

			<!-- Top Menu Toolbar -->
			<v-toolbar app flat color="primary" class="white--text">
				<v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer" dark>
				</v-toolbar-side-icon>
				<v-toolbar-title class="title-logo" @click="$router.push('/')">JESTE</v-toolbar-title>
				<v-spacer class="hidden-xs-only"></v-spacer>
				<!-- Top Menu Links -->
				<v-toolbar-items class="hidden-xs-only btns-wrapper">
					<v-menu mx-2 open-on-hover bottom offset-y v-for="(item, index) in menuItems" :key="index">
						<v-btn flat slot="activator" :to="(item.link)" exact class="white--text">
							{{ item.title }}
						</v-btn>
						<v-list v-if="user && index === 2">
							<v-list-tile :to="`/user/${user._id}`" excat>
								<v-list-tile-title>Profile</v-list-tile-title>
							</v-list-tile>
							<v-list-tile to="/user/settings" excat>
								<v-list-tile-title>Settings</v-list-tile-title>
							</v-list-tile>
							<v-list-tile @click="logout" excat>
								<v-list-tile-title>Logout</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>
				</v-toolbar-items>
			</v-toolbar>

      <v-content class="content">
        <!-- <v-container fluid> -->
        <transition name="moveInUp">
          <router-view/>
        </transition>
        <!-- </v-container> -->
      </v-content>

      <v-snackbar v-model="snackbarDisplay" :top="snackbarProps.y === 'top'" :bottom="snackbarProps.y === 'bottom'" :left="snackbarProps.x === 'left'" :right="snackbarProps.x === 'right'" :multi-line="snackbarProps.mode === 'multi-line'" :vertical="snackbarProps.mode === 'vertical'" :timeout="snackbarProps.timeout" :color="snackbarProps.bgColor">
        {{ snackbarProps.text }}
        <v-btn flat :color="snackbarProps.btnColor" @click="snackbarDisplay = false">
          Close
        </v-btn>
      </v-snackbar>

    </v-app>
    Location: {{location}}
  </div>
</template>

<script>
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { JESTES_LOAD, FILTER_UPDATE } from "@/modules/JesteModule";
import {
  USER_CHECK_LOGIN,
  USER_CONNECTED,
  USER_LOGOUT,
  GET_USER_LOCATION
} from "@/modules/UserModule";

export default {
  name: "app",
  created() {
    console.log("--- Jeste App ---");
    if (!this.$store.getters.USER_CONNECTED) {
      this.loadUser();
    }
    this.$store.dispatch(GET_USER_LOCATION).then(coords => {
      this.$store.commit({ type: FILTER_UPDATE, filter: { coords } });

      this.loadJestes();
    });
  },
  sockets: {
    reciveMsg() {
      alert("recive msg");
    }
  },
  mounted() {
    EventBus.$on(SNACK_MSG, msg => this.toggleSnackbar(msg));
  },
  data() {
    return {
      drawer: null,
      menuItems: [
        { title: "Home", icon: "home", link: "/" },
        { title: "Jeste", icon: "assistant", link: "/jeste" },
        {
          title: "Signup \\ Login",
          icon: "swap_horizontal_circle",
          link: "/login"
        },
        { title: "About", icon: "info", link: "/about" }
      ],
      searchValue: "",

      snackbarDisplay: false,
      snackbarProps: {
        y: "top",
        x: null,
        mode: "multi-line",
        timeout: 3000,
        text: "",
        type: "black"
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters[USER_CONNECTED];
    },
    location() {
      return this.$store.getters[GET_USER_LOCATION];
    }
  },
  methods: {
    loadUser() {
      this.$store.dispatch(USER_CHECK_LOGIN)
        .then(_ => {
          console.log("User Loggedin");
        })
        .catch(err => console.log(err));
    },
    loadJestes() {
      this.$store.dispatch({ type: JESTES_LOAD });
    },
    pushToLink(link) {
      this.$router.push(link);
    },
    toggleSnackbar(msg) {
      this.snackbarProps.text = msg.text;
      this.snackbarProps.bgColor = msg.bgColor
        ? msg.bgColor
        : this.snackbarProps.bgColor;
      this.snackbarDisplay = true;
    },
    logout() {
      let fName = this.$store.getters[USER_CONNECTED].details.firstName;
      this.$store.dispatch(USER_LOGOUT).then(_ => {
        EventBus.$emit(SNACK_MSG, { text: `Bey ${fName}`, bgColor: "info" });
        console.log("Logged out successfuly");
        this.$router.push("/");
      });
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.$socket.emit("userLogged", {
          userId: this.user._id
        });
        this.menuItems[2] = {
          title: this.user.details.firstName + " " + this.user.details.lastName,
          link: "#",
          icon: "account_circle"
        };
      } else {
        this.menuItems[2] = {
          title: "Signup \\ Login",
          link: "/login",
          icon: "swap_horizontal_circle"
        };
      }
    },
    snackbarDisplay() {
      if (!this.snackbarDisplay) {
        this.snackbarProps.bgColor = "black";
        this.snackbarProps.btnColor = "white";
      }
    }
  },
  snackbarDisplay() {
    if (!this.snackbarDisplay) {
      this.snackbarProps.bgColor = "black";
      this.snackbarProps.btnColor = "white";
    }
  }
};
</script>

<style lang="scss">
.content {
  background: rgba(3, 20, 37, 0.2);
}

.v-toolbar__title:not(:first-child) {
  min-width: 55px;
  margin: 0 5px !important;
  cursor: pointer;
}
.btns-wrapper {
  margin-left: 8px;
}

.moveInUp-enter-active {
  // transition: all 0.4s ease;
  transition: all 0.45s linear;
}
.moveInUp-leave-active {
  transition: all 0.45s linear;
  // transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.moveInUp-enter,
.moveInUp-leave-to {
  // position: absolute;
   position: fixed;
  top: 64px;
}
.moveInUp-enter {
  transform: translateX(-100%);
   position: fixed;
  top: 64px;
}
.moveInUp-leave-to {
  // transform: translateY(100%);
  position: fixed;
  top: 64px;

  transform: translateX(100%);
  opacity: 0;
}
</style>