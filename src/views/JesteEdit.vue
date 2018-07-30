<template>
	<section class="jeste-edit">
		<h1>{{isEdit? 'Edit': 'Add'}} Jeste</h1>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field v-model="jesteToSave.title" label="title" required></v-text-field>
			<v-text-field v-model="jesteToSave.description" label="description" required></v-text-field>
			<v-text-field @keyup.enter.prevent="" label="goomaps test" required ref="autocomplete" append-icon="search" v-model="jesteToSave.formatted_address" :rules="addressRules"></v-text-field>

			<ComboBox v-model="jesteToSave.keywords"></ComboBox>


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
			currPlace: null,
			addressRules: [
				v => {
					return !!v || 'Address is required';
				},
				v => {
					return (
						(!!v && this.currPlace && this.currPlace.formatted_address === this.$refs.autocomplete.value) || 'Please type a valid address'
					);
				}
			],

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
			let _this = this;

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
		this.autocomplete.addListener('place_changed', () => {
			this.currPlace = this.autocomplete.getPlace();
			this.jesteToSave.address_components = this.currPlace.address_components;
			this.jesteToSave.formatted_address = this.currPlace.formatted_address;
			this.jesteToSave.destination_loc.coordinates.splice(0,1,+this.currPlace.geometry.location.lat());
			this.jesteToSave.destination_loc.coordinates.splice(1,1,+this.currPlace.geometry.location.lng())
			console.log(this.jesteToSave)
			})
	},
	methods: {
		getJeste(id) {
			this.$store.dispatch({ type: JESTE_GET_BY_ID, id }).then(jeste => {
				this.jesteToSave = JSON.parse(JSON.stringify(jeste));
				this.currPlace = {
					formatted_address: jeste.formatted_address
				}
			});
		},
		submit() {
			if (this.$refs.form.validate()) {

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