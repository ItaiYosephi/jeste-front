<template>
    <v-layout row wrap justify-center>
        <JestePreview
            v-for="jeste in jestes"
            :key="jeste._id"
            :to="'/jeste/' + jeste._id"
            :jeste="jeste" />
    </v-layout>
</template>

<script>
import JestePreview from "./JestePreview";

export default {
  name: "jesteList",
  components: {
    JestePreview
  },
  props: {
    jestes: Array
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_vars.scss";
@import "../../assets/styles/_helpers.scss";

</style>
