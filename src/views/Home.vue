<template>
	<section class="home">

		<agile :arrows="false" :speed="800" :timing="'linear'" :fade="true" :autoplay="true" :pauseOnHover="false" ref="agile">
			<div class="slide slide--1">
				<JesteFrontSection :scroll-list="scrollList" :jestesStats="jestesStats" />
			</div>
			<div class="slide slide--2">
				<JesteFrontSection :scroll-list="scrollList" :jestesStats="jestesStats" />
			</div>
			<div class="slide slide--3">
				<JesteFrontSection :scroll-list="scrollList" :jestesStats="jestesStats" />
			</div>
			<div class="slide slide--4">
				<JesteFrontSection :scroll-list="scrollList" :jestesStats="jestesStats" />
			</div>
			<div class="slide slide--5">
				<JesteFrontSection :scroll-list="scrollList" :jestesStats="jestesStats" />
			</div>
		</agile>

		<h1 ref="recent">Recent Jestes</h1>
		<div class="load-wrapper" v-if="isLoading">
			<LoadingCmp/>
		</div>
		<JesteList v-else ref="listRecent" :jestes="jestesToDisplayRecent" />
		<h1>Nearby Jestes</h1>
		<div class="load-wrapper" v-if="isLoading">
			<LoadingCmp/>
		</div>
		<JesteList v-else ref="listNearby" :jestes="jestesToDisplay" />
	</section>

</template>

<script>
import * as easings from 'vuetify/es5/util/easing-patterns';

import LoadingCmp from '@/components/LoadingCmp';
import JesteFrontSection from '@/components/jestes/JesteFrontSection';
import JesteList from '@/components/jestes/JesteList';
import JesteFilter from '@/components/jestes/JesteFilter';
import {
	JESTES_LOAD,
	JESTES_TO_DISPLAY,
	JESTE_IS_LOADING,
	JESTES_LOAD_STATS,
	JESTES_STATS,
	JESTES_RECENT_TO_DISPLAY,
	JESTES_LOAD_RECENT
} from '@/modules/JesteModule';
import { UPDATE_TITLE } from '@/store';

export default {
	name: 'home',
	components: {
		JesteList,
		JesteFilter,
		JesteFrontSection,
		LoadingCmp
	},
	created() {
		this.$store.commit({ type: UPDATE_TITLE, title: 'Jeste - Home' });
		this.$store.dispatch(JESTES_LOAD_STATS);
	},
	mounted() {
		this.$emit('toggle-nav', 'trans')

		window.addEventListener('scroll', this.onScroll);
	},
	destroyed() {
				window.removeEventListener('scroll', this.onScroll);

		this.$emit('toggle-nav', 'solid')
	},
	data() {
		return {
			bgImages: [
				'/img/bg-main-1.jpg',
				'/img/bg-main-2.jpg',
				'/img/bg-main-3.jpg',
				'/img/bg-main-4.jpg'
			]
		};
	},
	computed: {
		jestesToDisplay() {
			return this.$store.getters[JESTES_TO_DISPLAY];
		},
		jestesToDisplayRecent() {
			return this.$store.getters[JESTES_RECENT_TO_DISPLAY];
		},
		isLoading() {
			return this.$store.getters[JESTE_IS_LOADING];
		},
		jestesStats() {
			return this.$store.getters[JESTES_STATS];
		}
	},
	methods: {
		loadRecentJestes() {
			this.$store.dispatch(JESTES_LOAD_RECENT);
		},
		onScroll() {
			if (window.pageYOffset > 64) {
				this.$emit('toggle-nav', 'solid');
			} else {
				this.$emit('toggle-nav', 'trans');
			}
		},
		scrollList() {
			this.$vuetify.goTo($refs.listRecent, {easeing: 'easeInQuad', offset: -100, duration: 600});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';

.slide {
	height: 100vh;
	background: {
		position: center;
		size: cover;
	}
	&--1 {
		background-image: url('/img/bg-main-1.jpg');
	}
	&--2 {
		background-image: url('/img/bg-main-2.jpg');
	}
	&--3 {
		background-image: url('/img/bg-main-3.jpg');
	}
	&--4 {
		background-image: url('/img/bg-main-4.jpg');
	}
	&--5 {
		background-image: url('/img/bg-main-5.jpg');
	}
}

.load-wrapper {
	height: 100%;
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
}

h1 {
	margin-top: 10px;
	padding: 0 20px;
	font-size: 2em;
	font-weight: 500;
}
.home {
	margin-top: -56px;
	@media (min-width: 600px) and (max-width: 960px) {
		margin-top: -48px;
	}
	@media (min-width: 960px) {
		margin-top: -64px;
	}

}
</style>