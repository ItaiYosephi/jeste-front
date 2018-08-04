<template>
	<section class="home">
		<section class="back-img">
			<v-layout column wrap justify-center align-center class="main-content">
				<div class="header">jeste</div>
				<div class="sub-header">help others | get help</div>
        <v-spacer></v-spacer>
        <div class="stats">
          <span class="stat">
            64
          </span> |
          <span class="stat">
            32
          </span> |
          <span class="stat">
            16
          </span>
        </div>
        <v-btn large color="primary" @click="$vuetify.goTo($refs.list, {easeing: 'easeInQuad', offset: -64, duration: 600})" >do a jeste</v-btn>
        <v-btn large color="primary" to="/jeste/edit">ask for jeste</v-btn>
        <v-spacer></v-spacer>
			</v-layout>
		</section>
		<div  class="load-wrapper" v-if="isLoading">
			<LoadingCmp/>
		</div>
		<JesteList ref="list" :jestes="jestesToDisplay" />
	</section>
</template>

<script>
import * as easings from 'vuetify/es5/util/easing-patterns'

import LoadingCmp from "@/components/LoadingCmp";
import JesteList from "@/components/jestes/JesteList";
import JesteFilter from "@/components/jestes/JesteFilter";
import { JESTES_LOAD, JESTES_TO_DISPLAY, JESTE_IS_LOADING } from "@/modules/JesteModule";

export default {
  name: "home",
  components: { 
		JesteList,
    JesteFilter,
    LoadingCmp
  },
  computed: {
    jestesToDisplay() {
      // console.log("jestes", this.$store.getters[JESTES_TO_DISPLAY]);
      return this.$store.getters[JESTES_TO_DISPLAY];
    },
    isLoading() {
      return this.$store.getters[JESTE_IS_LOADING];
    },
    target() {

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";
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
  @media (min-width: 960px){
    height: calc(100vh - 64px);
  }
}

.main-content {
  height: 100%;
  // padding: 5px;
  color: white;
  background: rgba(3, 20, 36, 0.35);
  .header {
    text-transform: uppercase;
    font-size: 5em;
    letter-spacing: 1.5px;
    font-family: "Open Sans", "Roboto", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
  .sub-header {
    font-family: "Open Sans", "Roboto", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    margin-top: -10px;
    font-size: 1.25em;
    letter-spacing: 1.1px;
    text-transform: uppercase;
  }
  .stats {
    text-transform: uppercase;
    font-size: 2.25em;
    letter-spacing: 1.2px;
    font-family: "Open Sans", "Roboto", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
  @media (min-width: 600px) {
    .header {
      font-size: 6.5em;
      letter-spacing: 2px;
    }
    .sub-header {
      font-size: 2em;
      letter-spacing: 1.5px;
    }
  }
}
</style>