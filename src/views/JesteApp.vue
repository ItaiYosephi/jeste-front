<template>
  <section class="jeste-app">
    <v-jumbotron class="jumbotron" height="375px" dark>
      <v-container fill-height>
        <v-layout align-center wrap>
          <div class="filter-header">do jestes for others.</div>
          <JesteFilter/>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <div class="load-wrapper" v-if="isLoading">
      <LoadingCmp/>
    </div>
    <JesteList v-else :jestes="jestesToDisplay" />
    <v-btn fixed fab bottom right ripple color="secondary" to="/jeste/edit">
      <v-icon>add</v-icon>
    </v-btn>
  </section>
</template>

<script>
import LoadingCmp from '@/components/LoadingCmp';
import JesteList from '@/components/jestes/JesteList';
import JesteFilter from '@/components/jestes/JesteFilter';
import {
	JESTES_LOAD,
	JESTES_TO_DISPLAY,
	JESTE_IS_LOADING
} from '@/modules/JesteModule';
import { UPDATE_TITLE } from '@/store';

export default {
	name: 'jesteApp',
	components: {
		LoadingCmp,
		JesteList,
		JesteFilter
	},
	created() {
		this.$store.commit({ type: UPDATE_TITLE, title: 'Jeste - Search' });
	},
	mounted() {
		// this.$vuetify.goTo(0, {easeing: 'easeInQuad', duration: 600});
	},
	computed: {
		isLoading() {
			return this.$store.getters[JESTE_IS_LOADING];
		},
		jestesToDisplay() {
			// console.log("jestes", this.$store.getters[JESTES_TO_DISPLAY]);
			return this.$store.getters[JESTES_TO_DISPLAY];
		}
	}
};
</script>

<style lang="scss" scoped>
.load-wrapper {
	height: 100%;
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.jumbotron {
	background: #21a7e8;
	.filter-header {
		font-size: 2em;
		margin: -5px 0;
		text-transform: uppercase;
	}
}
</style>