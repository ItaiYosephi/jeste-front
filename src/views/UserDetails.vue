<template>
	<v-layout class="user-details" v-if="user" column justify-center align-center>
		<v-flex>
			<v-card justify-center>
				<v-layout row>
					<v-flex xl2>
						<v-card-title primary-title>
							<v-avatar>
								<img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="avatar">
							</v-avatar>
							<div class="v-title">
								<div class="headline">{{user.details.firstName}} {{user.details.lastName}}</div>
								<span class="grey--text">Weizmen Street, Tel Aviv</span>
							</div>
						</v-card-title>
					</v-flex>
				</v-layout>
        <v-card-text>
					<v-list two-line>
						<v-list-tile-content>
							<v-list-tile-title>{{user.details.age}}</v-list-tile-title>
							<v-list-tile-sub-title>Age</v-list-tile-sub-title>
						</v-list-tile-content>
						<v-list-tile-content>
							<v-list-tile-title>{{user.mobile}}</v-list-tile-title>
							<v-list-tile-sub-title>Mobile</v-list-tile-sub-title>
						</v-list-tile-content>
						<v-list-tile-content>
							<v-list-tile-title>{{user.email}}</v-list-tile-title>
							<v-list-tile-sub-title>e-mail</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list>
					<div class="sub-headline">Some words about you</div>
					I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier,
					not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to
					that or we walk! You're going to do his laundry? I've got to find a way to escape.
				</v-card-text>
			</v-card>
		</v-flex>

		<v-flex my-2 class="tabs-wrapper" v-if="reqJestes || resJestes">
			<v-tabs grow class="elevation-1 ">
				<v-tab v-for="item in tabs" :key="item" ripple>
					{{item.name}}
				</v-tab>
				<v-tab-item v-for="item in tabs">
					<v-card flat>
						<v-expansion-panel>
							<v-expansion-panel-content v-for="(jeste, idx) in item.jestes" :key="idx">
								<div slot="header">{{jeste}}</div>
								<v-card>
									<v-card-text>{{jeste.description}}</v-card-text>
								</v-card>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</v-flex>
	</v-layout>

</template>

<script>
import { USER_CONNECTED } from "@/modules/UserModule";
import { JESTE_GET_BY_ID } from "@/modules/JesteModule";

export default {
  name: "userDetails",
  data() {
    return {
      userId: this.$route.params.id,
      reqJestes: null,
      resJestes: null,
      tabs: [
        { name: "asked jestes", jestes: this.reqJestes },
        { name: "made jestes", jestes: this.resJestes }
      ]
    };
  },
  computed: {
    user() {
      console.log("user", this.$store.getters[USER_CONNECTED]);
      return this.$store.getters[USER_CONNECTED];
    }
  },
  methods: {
    loadReqJestes() {
      let jestes = [{}];
      this.user.jestes_req.forEach(jesteId => {
        this.$store.dispatch({ type: JESTE_GET_BY_ID, id: jesteId })
          .then(jeste => {
            console.log('jeste', jeste);
            jestes.push(jeste)
          });
      });
      console.log("test", jestes);
      this.reqJestes = jestes;
    },
    loadResJestes() {
      let jestes = [{}];
      this.user.jestes_res.forEach(jesteId => {
        this.$store.dispatch({ type: JESTE_GET_BY_ID, id: jesteId })
          .then(jeste => jestes.push(jeste));
      });
      console.log("test", jestes);
      this.resJestes = jestes;
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.loadReqJestes();
        this.loadResJestes();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";
.user-details {
  max-width: 780px;
  margin: 0 auto;
}
.v-avatar,
.v-title {
  margin: 5px;
}
.v-card__text {
  font-size: 1.1em;
}

.sub-headline {
  font-size: 1.1em;
}
.tabs-wrapper {
  align-self: stretch;
}
</style>