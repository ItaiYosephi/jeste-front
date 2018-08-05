<template>
	<v-form>
		<v-layout row wrap>
			<v-flex xs12 md7>
				<v-text-field color="secondary" v-model="txt" flat hide-details clearable prepend-inner-icon="search" label="Free Text" @keyup.enter.native="filterJestes" @click:prepend-inner="filterJestes">
				</v-text-field>
			</v-flex>
			<v-spacer></v-spacer>
			<v-flex xs12 md4>
				<v-select color="secondary" :items="categories" v-model="category" label="Categories">
				</v-select>
			</v-flex>
			<v-flex xs8 sm4>
				<v-slider color="secondary" v-model="maxPrice" label="Price" :max="200">
				</v-slider>
			</v-flex>
			<v-spacer class="hidden-sm-and-up"></v-spacer>
			<v-flex xs2 sm1 class="text-slider">
				<v-text-field color="secondary" v-model="maxPrice" class="mt-0" type="number">
				</v-text-field>
			</v-flex>
			<v-spacer></v-spacer>
			<v-flex xs8 sm4>
				<v-slider color="secondary" v-model="maxDistance" label="Distance (km)" :max="100">
				</v-slider>
			</v-flex>
			<v-spacer class="hidden-sm-and-up"></v-spacer>
			<v-flex xs2 sm1 class="text-slider">
				<v-text-field color="secondary" v-model="maxDistance" class="mt-0" type="number">
				</v-text-field>
			</v-flex>
			<v-flex xs12 class="text-xs-right">
				<v-btn large @click="filterJestes">Search</v-btn>
			</v-flex>
		</v-layout>
	</v-form>
</template>

<script>
import {
	FILTER_GET,
	JESTES_LOAD,
	JESTE_CATEGORIES_GET,
	UPDATE_TXT_FILTER,
	UPDATE_CATEGORY_FILTER,
	UPDATE_MAXPRICE_FILTER,
	UPDATE_MAXDISTANCE_FILTER
} from '@/modules/JesteModule';

export default {
	name: 'jesteFIlter',
	data() {
		return {
			categories: this.$store.getters[JESTE_CATEGORIES_GET]
		};
	},
	methods: {
		filterJestes() {
			this.$store.dispatch({ type: JESTES_LOAD });
		}
	},
	computed: {
		filter() {
			return this.$store.getters[FILTER_GET];
		},
		txt: {
			get: function() {
				return this.filter.txt;
			},
			set: function(txt) {
				this.$store.commit({ type: UPDATE_TXT_FILTER, txt });
			}
		},
		category: {
			get: function() {
				return this.filter.category;
			},
			set: function(val) {
				this.$store.commit({ type: UPDATE_CATEGORY_FILTER, val });
			}
		},
		maxPrice: {
			get: function() {
				return this.filter.maxPrice;
			},
			set: function(val) {
				this.$store.commit({ type: UPDATE_MAXPRICE_FILTER, val });
			}
		},
		maxDistance: {
			get: function() {
				return this.filter.maxDistance / 1000;
			},
			set: function(val) {
				val *=1000
				this.$store.commit({ type: UPDATE_MAXDISTANCE_FILTER, val });
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_helpers.scss';
.text-slider {
	margin-left: 20px;
}
</style>