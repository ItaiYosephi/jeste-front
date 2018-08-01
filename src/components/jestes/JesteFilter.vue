<template>
  <v-form>
    <v-layout row wrap>  
      <v-flex xs12 md7>
        <v-text-field
          v-model="filterBy.txt"
          dark
          flat
          solo-inverted
          hide-details
          clearable
          prepend-inner-icon="search" label="Search"
          hide-details
          @keyup.enter.native="filterJestes"
          @click:prepend-inner="filterJestes">
        </v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs12 md4>
        <v-select
          :items="['Test1', 'Test2', 'Test3']"
          v-model="filterBy.category"
          label="Categories">
        </v-select>
      </v-flex>
      <v-flex xs8 sm4 class="m1">
        <v-slider
          v-model="filterBy.maxPrice"
          label="Price"
          :max="200">
        </v-slider>
      </v-flex>
      <v-flex xs2 sm1 class="m1">
        <v-text-field
          v-model="filterBy.maxPrice"
          class="mt-0"
          type="number">
        </v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs8 sm4 class="m1">
        <v-slider
          v-model="filterBy.maxDistance"
          label="Distance (km)"
          :max="100">
        </v-slider>
      </v-flex>
      <v-flex xs2 sm1 class="m1">
        <v-text-field
          v-model="filterBy.maxDistance"
          class="mt-0"
          type="number">
        </v-text-field>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import { FILTER_GET } from "@/modules/JesteModule";

export default {
  name: "jesteFIlter",
  props: [],
  data() {
    return {
      filterBy: this.$store.getters[FILTER_GET]
    };
  },
  methods: {
    filterJestes() {
      console.log("filterBy:", this.filterBy);
      this.$emit("doFilter", this.filterBy);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_helpers.scss";
.m1 {
  margin: 5px;
}
</style>