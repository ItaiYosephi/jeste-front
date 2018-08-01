<template>
    <section class="home">
        <section  class="back-img">
          <section class="main-content">
            <div class="header">JESTE</div>
            <div class="sub-header">Help to the people in your community and get help</div>
          </section>
        </section>
        <JesteList :jestes="jestesToDisplay" />
    </section>
</template>

<script>
import JesteList from "@/components/jestes/JesteList";
import JesteFilter from "@/components/jestes/JesteFilter";
import { JESTES_LOAD, JESTES_TO_DISPLAY } from "@/modules/JesteModule";

export default {
  name: "home",
  components: {
    JesteList,
    JesteFilter
  },
  computed: {
    jestesToDisplay() {
      // console.log("jestes", this.$store.getters[JESTES_TO_DISPLAY]);
      return this.$store.getters[JESTES_TO_DISPLAY];
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";

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
  // color: #031424; 
  // background: rgba(3, 154, 229, 0.507);
  span {
    background: white;
  }
  .header {
    text-transform: uppercase;
    font-size: 5.75em;
    letter-spacing: 1.75px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .sub-header {
    margin-top: -10px;
  }

}
</style>