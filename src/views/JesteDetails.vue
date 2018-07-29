<template>
	<section class="jeste-details">
		{{jeste}} {{position}}
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
					<GmapMap :center="position"  v-if="jeste.destination_loc" :zoom="15" map-type-id="terrain" style="width: 100%; height: 300px">
						<GmapMarker :position="position" :clickable="true" :draggable="true" @click="center=position" />
					</GmapMap>
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
			show: true
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
			if (this.jeste && this.jeste.imgs_url && this.jeste.imgs_url[0])
				return this.jeste.imgs_url[0];
			else return '';
		},
		position() {
			if (this.jeste.destination_loc) {

				return {
					lat: +this.jeste.destination_loc.coordinates[0],
					lng: +this.jeste.destination_loc.coordinates[1]
				};
			}
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