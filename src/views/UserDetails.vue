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

		<v-flex my-2 class="tabs-wrapper" >
			<v-tabs grow class="elevation-1" >
				<v-tab v-for="(tab, i) in tabs" :key="i">
					{{tab.name}}
				</v-tab>
				<v-tab-item v-for="(list, i) in tabs" :key="i">
					<v-card flat v-if="list.jestesList.length">
						<v-expansion-panel popout >
							<v-expansion-panel-content v-for="(jeste, idx) in list.jestesList" :key="idx">
								<div slot="header" class="jeste-title">{{jeste.title}}</div>
								<v-card>
									<v-card-title>
										<div>
											Address: <div>{{jeste.formatted_address}}</div>
										</div>
									</v-card-title>
									<v-card-text>
										Description: {{jeste.description}}
										<br/>
										Keywords:
										<v-chip label outline v-for="keyword in jeste.keywords" :key="keyword" color="info">{{keyword}}</v-chip>
									</v-card-text>
									<v-card-actions>
										<v-spacer></v-spacer>
          					<v-btn flat color="blue" :to="`/jeste/${jeste._id}`">more details</v-btn>
        					</v-card-actions>
								</v-card>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-card>
					<v-card flat v-else>
							<v-card-text>
								No Relevant Jestes
							</v-card-text>
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
  mounted() {
    if (this.user) this.loadJestes();
  },
  data() {
    return {
      userId: this.$route.params.id,
      reqJestes: null,
      resJestes: null,
      tabs: [
        { name: "asked jestes", jestesList: [] },
        { name: "made jestes", jestesList: [] }
      ],
      displayTabs: false
    };
	},
	computed: {
		user() {
			return this.$store.getters[USER_CONNECTED];
		}
	},
  methods: {
    loadReqJestes() {
      let jestes = [];
      this.user.jestes_req.forEach(jesteId => {
        this.$store.dispatch({ type: JESTE_GET_BY_ID, id: jesteId })
          .then(jeste => jestes.push(jeste));
      });
      this.reqJestes = jestes;
    },
    loadResJestes() {
      let jestes = [];
      this.user.jestes_res.forEach(jesteId => {
        this.$store.dispatch({ type: JESTE_GET_BY_ID, id: jesteId })
          .then(jeste => jestes.push(jeste));
      });
      this.resJestes = jestes;
    },
    loadJestes() {
      this.loadReqJestes();
			this.loadResJestes();
			console.log('Res', this.tabs);
			
      this.tabs[0].jestesList = this.reqJestes;
      this.tabs[1].jestesList = this.resJestes;
      this.displayTabs = true;
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.loadJestes();
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

.jeste-title {
	text-transform: capitalize;
	font-size: 1.35em;
}
</style>