<template>
  <section class="home">
    <section class="back-img">
      <v-layout column wrap justify-center align-center class="main-content">
        <div class="header">jeste</div>
        <div class="sub-header">help others | get help</div>
        <v-spacer></v-spacer>
        <div class="about">JESTE is a new way to help your communiuty in small works or jobs, and in return get help when you need it</div>
        <v-spacer></v-spacer>
        <v-layout row wrap justify-center class="stats">
          <div class="stat">
            <div>64</div>
            <div class="desc">total jestes</div>
          </div>
          <div class="stat">
            <div>32</div>
            <div class="desc">made jestes</div>
          </div>
          <div class="stat">
            <div>16</div>
            <div class="desc">active jestes</div>
          </div>
        </v-layout>
        <v-layout row wrap justify-center mt-2>
          <v-btn large color="primary" @click="$vuetify.goTo($refs.listRecent, {easeing: 'easeInQuad', offset: -100, duration: 600})">do a jeste</v-btn>
          <v-btn large color="primary" to="/jeste/edit">ask for jeste</v-btn>
        </v-layout>
        <v-spacer></v-spacer>
      </v-layout>
    </section>
    <h1>Recent Jestes</h1>
		<div class="load-wrapper" v-if="isLoading">
      <LoadingCmp/>
    </div>
    <JesteList v-else ref="listRecent" :jestes="jestesToDisplay" />
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
import { JESTES_LOAD, JESTES_TO_DISPLAY, JESTE_IS_LOADING } from '@/modules/JesteModule';
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
	},
	computed: {
		jestesToDisplay() {
			return this.$store.getters[JESTES_TO_DISPLAY];
		},
		isLoading() {
			return this.$store.getters[JESTE_IS_LOADING];
		},
		target() {}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';
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
	background: url(/img/main_bg.png) no-repeat center center fixed;
	background-size: cover;
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
	// padding: 5px;
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