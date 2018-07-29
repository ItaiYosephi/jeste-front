<template>
	<section class="jeste-edit">
		{{isEdit}}
		<h1>{{isEdit? 'Edit': 'Add'}} Jeste</h1>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field v-model="jesteToSave.title" label="title" required></v-text-field>
			<v-text-field v-model="jesteToSave.description" label="description" required></v-text-field>
			<vuetify-google-autocomplete :id="id" append-icon="search" :disabled="false" :enable-geolocation="true" placeholder="Street Address" required :rules="addressRules" v-on:placechanged="getAddressData">
			</vuetify-google-autocomplete>
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