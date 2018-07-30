<template>
	<section class="jeste-edit">
		<h1>{{isEdit? 'Edit': 'Add'}} Jeste</h1>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field v-model="jesteToSave.title" label="title" required></v-text-field>
			<v-text-field v-model="jesteToSave.description" label="description" required></v-text-field>
			<v-text-field @keyup.enter.prevent="" label="goomaps test" required ref="autocomplete" append-icon="search" v-model="jesteToSave.formatted_address" :rules="addressRules"></v-text-field>

			<ComboBox v-model="jesteToSave.keywords"></ComboBox>
			{{position}}
			<v-card-text v-show="show">
				<GmapMap :center="position" v-if="jesteToSave" :zoom="15" map-type-id="terrain" style="width: 100%; height: 300px">
					<GmapMarker :position="position" :clickable="false" :draggable="true" @click="center=position" />
				</GmapMap>
			</v-card-text>

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
// import {google} from 'vue2-google-maps'

export default {
	name: 'jesteEdit',
	data() {
		return {
			google: null,
			autocomplete: null,
			popo: 'sdfesfsefsef',
			valid: true,

			jesteToSave: JSON.parse(JSON.stringify(this.$store.getters[JESTE_EMPTY])),
			currPlace: null,
			addressRules: [
				v => {
					return !!v || 'Address is required';
				},
				v => {
					return (
						(!!v &&
							this.currPlace &&
							this.currPlace.formatted_address ===
								this.$refs.autocomplete.value) ||
						'Please type a valid address'
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
		} 
		
	},
	mounted() {
		this.$gmapApiPromiseLazy()
			.then(x => {
				this.google = x
				this.initGoogle()
				
				})
				
	},
	methods: {
		getJeste(id) {
			this.$store.dispatch({ type: JESTE_GET_BY_ID, id }).then(jeste => {
				this.jesteToSave = JSON.parse(JSON.stringify(jeste));
				this.currPlace = {
					formatted_address: jeste.formatted_address
				};
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
		initGoogle() {
			
		var el = this.$refs.autocomplete.$el.children[0].children[0].children[0]
			.children[1];

		this.autocomplete = new this.google.maps.places.Autocomplete(el, {
			types: ['geocode']
		});
		console.log('auto', this.autocomplete);
		
		console.log(google)
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
			this.jesteToSave.destination_loc.coordinates.splice(
				0,
				1,
				+this.currPlace.geometry.location.lat()
			);
			this.jesteToSave.destination_loc.coordinates.splice(
				1,
				1,
				+this.currPlace.geometry.location.lng()
			);
			console.log(this.jesteToSave);
		});
		}
	},

	computed: {
		isEdit() {
			return !!this.jesteToSave && !!this.jesteToSave._id;
		},
		position() {
			if (!this.jesteToSave || !this.jesteToSave.destination_loc || !this.jesteToSave || !this.jesteToSave.destination_loc )return {lat: 0, lng: 0}
			return {
				lat: +this.jesteToSave.destination_loc.coordinates[0],
				lng: +this.jesteToSave.destination_loc.coordinates[1]
			}

		},
		show() {
			return !!this.jesteToSave
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