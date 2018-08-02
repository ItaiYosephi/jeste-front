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
      <JesteList :jestes="jestesToDisplay" />
      <v-btn
          fixed
          fab
          bottom
          right
          ripple
          color="secondary"
          to="/jeste/edit">
          <v-icon>add</v-icon>
      </v-btn>
    </section>
</template>

<script>
import JesteList from "@/components/jestes/JesteList";
import JesteFilter from "@/components/jestes/JesteFilter";
import { JESTES_LOAD, JESTES_TO_DISPLAY } from "@/modules/JesteModule";

export default {
  name: "jesteApp",
  components: {
    JesteList,
    JesteFilter
  },
  computed: {
    jestesToDisplay() {
      // console.log("jestes", this.$store.getters[JESTES_TO_DISPLAY]);
      return this.$store.getters[JESTES_TO_DISPLAY];
    }
  }
};
</script>

<style lang="scss" scoped>

.jumbotron {
  background: #21a7e8;
  .filter-header {
    font-size: 2em;
    margin: -5px 0;
    text-transform: uppercase;
  }
}
</style>