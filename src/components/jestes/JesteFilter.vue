<template>
  <v-form>
    <v-layout row wrap>  
      <v-flex xs12 md7>
        <v-text-field
          color="secondary"
          v-model="filterBy.txt"
          flat
          hide-details
          clearable
          prepend-inner-icon="search"
          label="Free Text"
          @keyup.enter.native="filterJestes"
          @click:prepend-inner="filterJestes">
        </v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs12 md4>
        <v-select
          color="secondary"
          :items="categories"
          v-model="filterBy.category"
          label="Categories">
        </v-select>
      </v-flex>
      <v-flex xs8 sm4>
        <v-slider
          color="secondary"
          v-model="filterBy.maxPrice"
          label="Price"
          :max="200">
        </v-slider>
      </v-flex>
      <v-spacer class="hidden-sm-and-up"></v-spacer>
      <v-flex xs2 sm1 class="text-slider">
        <v-text-field
          color="secondary"
          v-model="filterBy.maxPrice"
          class="mt-0"
          type="number">
        </v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs8 sm4>
        <v-slider
          color="secondary"
          v-model="filterBy.maxDistance"
          label="Distance (km)"
          :max="100">
        </v-slider>
      </v-flex>
      <v-spacer class="hidden-sm-and-up"></v-spacer>
      <v-flex xs2 sm1 class="text-slider">
        <v-text-field
          color="secondary"
          v-model="filterBy.maxDistance"
          class="mt-0"
          type="number">
        </v-text-field>
      </v-flex>

      <v-flex xs12 class="text-xs-right">
      <v-btn large @click="filterJestes">Search</v-btn>
      </v-flex>
      
    </v-layout>
  </v-form>
</template>

<script>
import { FILTER_GET, JESTES_LOAD, JESTE_CATEGORIES_GET } from "@/modules/JesteModule";

export default {
  name: "jesteFIlter",
  data() {
    return {
      filterBy: this.$store.getters[FILTER_GET],
      categories: this.$store.getters[JESTE_CATEGORIES_GET]
    };
  },
  methods: {
    filterJestes() {
      let filterBy = JSON.parse(JSON.stringify(this.filterBy));
      filterBy.maxDistance = filterBy.maxDistance * 1000;
      console.log("filterBy:", filterBy);
      this.$store.dispatch({type: JESTES_LOAD, filterBy })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_helpers.scss";
.text-slider {
  margin-left: 20px;
}
</style>