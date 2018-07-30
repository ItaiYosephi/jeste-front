<template>
    <section class="jeste-app">
        <JesteList :jestes="jestesToDisplay" />
        <v-btn
              fixed
              dark
              fab
              bottom
              right
              ripple
              color="accent"
              to="/jeste/edit">
          <v-icon>add</v-icon>
        </v-btn>
    </section>
</template>

<script>
import JesteList from "@/components/jestes/JesteList";
import { JESTES_LOAD, JESTES_TO_DISPLAY } from "@/modules/JesteModule";

export default {
  name: "jesteApp",
  components: {
    JesteList
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

.jeste-app {
  color: $mainColor;
}
</style>