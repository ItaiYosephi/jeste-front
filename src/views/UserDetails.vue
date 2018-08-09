<template>
	<v-container fluid grid-list-md>
		<v-layout v-if="user" justify-center wrap>
			<v-flex xs12 md6>
				<v-card>
					<v-toolbar color="primary" class="text--text" flat>
						<v-toolbar-title>{{user.details.firstName}}'s Details</v-toolbar-title>
					</v-toolbar>
					<v-card-title primary-title>
						<v-avatar>
							<img :src="imgUrl" alt="avatar">
						</v-avatar>
						<div class="v-title">
							<div class="headline">{{user.details.firstName}} {{user.details.lastName}}</div>
							<span class="grey--text">{{user.formatted_address}}</span>
						</div>
					</v-card-title>
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
						I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
					</v-card-text>
				</v-card>
			</v-flex>

			<v-flex xs12 md6>
				<v-tabs grow class="elevation-1" color="primary" slider-color="secondary">
					<v-tab v-for="(tab, i) in tabs" :key="i" class="text--text">
						{{tab.name}}
					</v-tab>
					<v-tab-item v-for="(list, i) in tabs" :key="i">
						<v-card flat v-if="list.jestesList.length">
							<v-expansion-panel>
								<v-expansion-panel-content v-for="(jeste, idx) in list.jestesList" :key="idx">
									<div slot="header" class="jeste-title">{{jeste.title}}</div>
									<v-card>
										<v-card-title>
											<div>
												Address:
												<div>{{jeste.formatted_address}}</div>
											</div>
										</v-card-title>
										<v-card-text>
											Description: {{jeste.description}}
											<br/> Keywords:
											<v-chip label outline v-for="keyword in jeste.keywords" :key="keyword" color="secondary">{{keyword}}</v-chip>
										</v-card-text>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn outline color="primary" :to="`/jeste/${jeste._id}`">more details</v-btn>
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
	</v-container>
</template>

<script>
import { USER_CONNECTED, USER_GET_BY_ID } from '@/modules/UserModule';
import { JESTE_GET_BY_ID } from '@/modules/JesteModule';
import { UPDATE_TITLE } from '@/store';

export default {
	name: 'userDetails',
	created() {
		this.getUser();
		this.$store.commit({
			type: UPDATE_TITLE,
			title: 'Jeste - User Details'
		});
	},
	mounted() {},
	data() {
		return {
			title: 'popo1',
			userId: this.$route.params.id,
			tabs: [
				{ name: 'asked jestes', jestesList: [] },
				{ name: 'made jestes', jestesList: [] }
			],
			displayTabs: false,
			user: null
		};
	},
	computed: {
		imgUrl() {
			if (this.user && this.user.img && this.user.img.secure_url)
				return this.user.img.secure_url;
			else return 'https://vuetifyjs.com/apple-touch-icon-180x180.png';
		}
	},
	methods: {
		getUser() {
			this.$store
				.dispatch({ type: USER_GET_BY_ID, id: this.userId })
				.then(user => {
					this.user = user;
					this.tabs[0].jestesList = user.req_jestes;
					this.tabs[1].jestesList = user.res_jestes;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_helpers.scss';

.user-details {
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

.jeste-title {
	text-transform: capitalize;
	font-size: 1.35em;
}
</style>