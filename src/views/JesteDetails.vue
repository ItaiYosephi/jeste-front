<template>
	<section class="jeste-details">
		{{jeste}}
		<v-card>
			<v-card-media :src="imgUrl" height="200px">
			</v-card-media>

			<v-card-title primary-title>
				<div>
					<div class="headline">{{jeste.title}}</div>
					<span class="grey--text">{{jeste.description}}</span>
				</div>
			</v-card-title>

			<v-card-actions>
				<v-btn flat color="blue" @click.prevent="">Jeste It!</v-btn>
				<v-btn flat>Share</v-btn>
				<v-spacer></v-spacer>
				<v-btn icon @click="show = !show">
					<v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
				</v-btn>
			</v-card-actions>

			<v-slide-y-transition>
				<v-card-text v-show="show">
					I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
				</v-card-text>
			</v-slide-y-transition>
		</v-card>
	</section>
</template>

<script>
import { JESTE_GET, JESTE_GET_BY_ID } from '@/modules/JesteModule';
export default {
	name: 'jesteDetails',
	data() {
		return {
			jeste: {},
			show: false
		};
	},
	created() {
		this.getJeste();
	},
	methods: {
		getJeste() {
			let id = this.$route.params.id;
			let jeste = this.$store.getters[JESTE_GET](id);
			if (!jeste) {
				this.$store
					.dispatch({ type: JESTE_GET_BY_ID, id })
					.then(jeste => (this.jeste = jeste));
			} else {
				this.jeste = jeste;
			}
		}
	},
	computed: {
		imgUrl() {
			if (this.jeste && this.jeste.imgs_url && this.jeste.imgs_url[0]) return this.jeste.imgs_url[0];
			else return ''

		}

	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';

.jeste-details {
	color: $mainColor;
}
</style>