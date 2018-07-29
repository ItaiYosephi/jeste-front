<template>
	<section class="jeste-edit">
		<h1>{{isEdit? 'Edit': 'Add'}} Jeste</h1>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field v-model="jesteToSave.title" label="title" required></v-text-field>
			<v-text-field v-model="jesteToSave.description" label="description" required></v-text-field>
			<v-text-field class="autocomplete" label="goomaps test" required ref="autocomplete" v-model="jesteToSave.address_str"></v-text-field>
			<!-- <vuetify-google-autocomplete :id="id" append-icon="search" v-model="jesteToSave.address_str" :disabled="false" :enable-geolocation="true" placeholder="Street Address" required :rules="addressRules" v-on:placechanged="getAddressData">
			</vuetify-google-autocomplete> -->
			<!-- <input ref="autocomplete" 
				placeholder="Search" 
				class="search-location"
				onfocus="value = ''" 
				type="text" /> -->
			<ComboBox v-model="jesteToSave.keywords"></ComboBox>

			address:{{address}}

			<v-btn :disabled="!valid" @click.prevent="submit">
				submit
			</v-btn>
			<v-btn @click="clear">clear</v-btn>
		</v-form>
		<pre>
	{{jesteToSave}}
		</pre>
	</section>
</template>

<script>
import {
	JESTE_EMPTY,
	JESTE_GET_BY_ID,
	JESTE_GET,
	JESTE_SAVE
} from '@/modules/JesteModule';
import ComboBox from '@/components/ComboBox';

export default {
	name: 'jesteEdit',
	data() {
		return {
			autocomplete: null,
			popo: 'sdfesfsefsef',
			valid: true,

			jesteToSave: {},

			addressRules: [
				v => {
					return !!v || 'Address is required';
				},
				v => {
					return (
						(!!v && !!this.address) || 'Please type a valid address'
					);
				}
			],

			address: {},
			id: 'maps',
			labelText: 'Search Address',
			placeholderText: '',
			types: ['address']
		};
	},
	created() {
		let id = this.$route.params.id;
		if (id) {
			this.getJeste(id);
		} else {
			this.jesteToSave = JSON.parse(
				JSON.stringify(this.$store.getters[JESTE_EMPTY])
			);
		}
	},
	mounted() {
		var el = this.$refs.autocomplete.$el.children[0].children[0].children[0]
			.children[1];

		this.autocomplete = new google.maps.places.Autocomplete(el, {
			types: ['geocode']
		});

		if (navigator.geolocation) {
			let _this = this
			
			
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				
				var circle = new window.google.maps.Circle({
					center: geolocation,
					radius: position.coords.accuracy
				});

				_this.autocomplete.setBounds(circle.getBounds());
			});
		}
	},
	methods: {
		getJeste(id) {
			this.$store.dispatch({ type: JESTE_GET_BY_ID, id }).then(jeste => {
				this.jesteToSave = JSON.parse(JSON.stringify(jeste));
			});
		},
		submit() {
			if (this.$refs.form.validate()) {
				this.jesteToSave.destination_loc.coordinates.splice(
					0,
					1,
					+this.address.latitude
				);
				this.jesteToSave.destination_loc.coordinates.splice(
					1,
					1,
					this.address.longitude
				);
				this.jesteToSave.address = this.address;

				// Native form submission is not yet supported
				this.$store.dispatch({
					type: JESTE_SAVE,
					jesteToSave: this.jesteToSave
				});
			}
		},
		clear() {
			this.$refs.form.reset();
		},
		getAddressData(addressData, placeResultData) {
			this.address = addressData;
		}
	},

	computed: {
		isEdit() {
			return !!this.jesteToSave && !!this.jesteToSave._id;
		}
	},
	components: {
		ComboBox
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';

.jeste-edit {
	color: $mainColor;
}
</style>