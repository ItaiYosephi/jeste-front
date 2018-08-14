<template>
    <section class="home">

        <v-carousel hide-controls hide-delimiters interval="5000" class="back-img">
            <v-carousel-item v-for="(img, i) in bgImages" :key="i" :src="img" reverse-transition="fade" transition="fade">
                <section class="back-img">
                    <v-layout column wrap justify-center align-center class="main-content">
                        <div class="header">jeste</div>
                        <div class="sub-header">help others | get help</div>
                        <v-spacer></v-spacer>
                        <div class="about">JESTE is a new way to help your communiuty in small works or jobs, and in return
                            get help when you need it</div>
                        <v-spacer></v-spacer>
                        <v-layout row wrap justify-center class="stats">
                            <div class="stat">
                                <div>{{jestesStats[0] + jestesStats[1] + jestesStats[2] + jestesStats[3]}}</div>
                                <div class="desc">total jestes</div>
                            </div>
                            <div class="stat">
                                <div>{{jestesStats[3]}}</div>
                                <div class="desc">completed jestes</div>
                            </div>
                            <div class="stat">
                                <div>{{jestesStats[0] + jestesStats[1] + jestesStats[2]}}</div>
                                <div class="desc">active jestes</div>
                            </div>
                        </v-layout>
                        <v-layout row wrap justify-center mt-2>
                            <v-btn large color="primary" @click="$vuetify.goTo($refs.listRecent, {easeing: 'easeInQuad', offset: -100, duration: 600})">do
                                a jeste</v-btn>
                            <v-btn large color="primary" to="/jeste/edit">ask for jeste</v-btn>
                        </v-layout>
                        <v-spacer></v-spacer>
                    </v-layout>
                </section>
            </v-carousel-item>
        </v-carousel>

        <h1>Recent Jestes</h1>
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
import JesteList from '@/components/jestes/JesteList';
import JesteFilter from '@/components/jestes/JesteFilter';
import { JESTES_LOAD, JESTES_TO_DISPLAY, JESTE_IS_LOADING, JESTES_LOAD_STATS, JESTES_STATS, JESTES_RECENT_TO_DISPLAY, JESTES_LOAD_RECENT } from '@/modules/JesteModule';
import { UPDATE_TITLE } from '@/store';

export default {
	name: 'home',
	components: {
		JesteList,
		JesteFilter,
		LoadingCmp
	},
	created() {
		this.$store.commit({ type: UPDATE_TITLE, title: 'Jeste - Home' });
		this.$store.dispatch(JESTES_LOAD_STATS);
	},
	data() {
		return {
			bgImages: ['/img/bg-main-1.jpg', '/img/bg-main-2.jpg', '/img/bg-main-3.jpg', '/img/bg-main-4.jpg']
		}
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
			return this.$store.getters[JESTES_STATS]
		}
	},
	methods: {
		loadRecentJestes() {
			this.$store.dispatch(JESTES_LOAD_RECENT);
		},
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';

.fade {
	&-enter-active, &-leave-active, &-leave-to {
		transition: .8s ease-out;
    position: absolute;
    top: 0;
    left: 0;
	}
	&-enter, &-leave, &-leave-to {
		opacity: 0;
	}
}

.load-wrapper {
	height: 100%;
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.back-img {
	width: 100%;
	height: calc(100vh - 48px);
	@media (min-width: 960px) {
		height: calc(100vh - 64px);
	}
}

h1 {
	margin-top: 10px;
	padding: 0 20px;
	font-size: 2em;
	font-weight: 500;
	color: #031424;
}

.main-content {
	height: 100%;
	color: white;
	background: rgba(3, 20, 36, 0.5);
	.header {
		text-transform: uppercase;
		font-size: 4.8em;
		letter-spacing: 1.5px;
		font-family: 'Open Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana,
			sans-serif;
	}
	.sub-header {
		font-family: 'Open Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana,
			sans-serif;
		margin-top: -10px;
		font-size: 1.15em;
		letter-spacing: 1.1px;
		text-transform: uppercase;
	}
	.about {
		padding: 10px;
		text-align: center;
		font-size: 1.2em;
	}
	.stats {
		text-transform: uppercase;
		font-size: 2.25em;
		letter-spacing: 1.2px;
		font-family: 'Open Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana,
			sans-serif;
		.stat {
			padding: 0 10px;
			display: flex;
			flex-flow: column wrap;
			justify-content: center;
			align-content: center;
			align-items: center;
			.desc {
				text-align: center;
				font-size: 0.5em;
			}
		}
		.stat:not(:last-child) {
			border-right: 2px solid white;
		}
	}
	@media (min-width: 600px) {
		.header {
			font-size: 6.25em;
			letter-spacing: 2px;
		}
		.sub-header {
			font-size: 1.5em;
			letter-spacing: 1.5px;
		}
	}
}
</style>