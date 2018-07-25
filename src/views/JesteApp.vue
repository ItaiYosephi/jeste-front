<template>
    <section class="jeste-app">
      jeste-app
      <JesteList :jestes="jestesToDisplay" />
    </section>
</template>

<script>
import JesteList from "@/components/jestes/JesteList";

export default {
  name: "jesteApp",
  components: {
    JesteList
  },
  created() {
    this.loadJestes();
  },
  computed: {
    jestesToDisplay() {
      return this.$store.getters.jestesToDisplay;
    }
  },
  methods: {
    loadJestes(filterBy = '') {
      this.$store.dispatch({ type: 'loadJestes', filterBy })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";

.jeste-app {
  color: $mainColor;
}
</style>