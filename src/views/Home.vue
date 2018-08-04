<template>
	<section class="home">
		<section class="back-img">
			<section class="main-content">
				<div class="header">jeste</div>
				<div class="sub-header">help others | get help</div>
			</section>
		</section>
		<div class="load-wrapper" v-if="isLoading">
			<LoadingCmp/>
		</div>
		<JesteList :jestes="jestesToDisplay" />
	</section>
</template>

<script>
import JesteList from "@/components/jestes/JesteList";
import LoadingCmp from "@/components/LoadingCmp";
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";
.load-wrapper {
  text-align: center;
  padding: 50px;
  min-height: 400px;
}

.back-img {
  width: 100%;
  height: 75vh;
  min-height: 300px;
  background: url(/img/main_bg.png) no-repeat center center fixed;
  background-size: cover;
}

.main-content {
  height: 100%;
  text-align: center;
  padding: 10px 10px;
  color: white;
  background: rgba(3, 20, 36, 0.4);
  span {
    background: white;
  }
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