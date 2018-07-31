<template>
  <v-layout align-center justify-center>
    <v-flex class="container-wrapper">
      <v-card grow>
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title>{{isEdit? 'Edit': 'Add'}} Jeste</v-toolbar-title>
        </v-toolbar>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-text-field box v-model="jesteToSave.title" label="Title" required></v-text-field>
            <v-textarea box v-model="jesteToSave.description" label="Description" hint="Few words about the jeste" required></v-textarea>
            <v-text-field box v-model="jesteToSave.formatted_address" ref="autocomplete" label="Street" @keyup.enter.prevent append-icon="search" :rules="addressRules" required>
            </v-text-field>

						<ComboBox v-model="jesteToSave.keywords"></ComboBox>
						<v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
					    <img :src="imageUrl" height="150" v-if="imageUrl"/>
					    <v-text-field box label="Select Image" @click='pickFile' v-model='imageName' append-icon='attach_file' @focus="pickFile" @click:append="pickFile"></v-text-field>
					    <input
						    type="file"
						    style="display: none"
						    ref="image"
						    accept="image/*"
						    @change="onFilePicked">
				    </v-flex>
						<v-card-text v-show="show">
							<GmapMap :center="position" v-if="jesteToSave" :zoom="15" map-type-id="terrain" style="width: 100%; height: 300px">
								<GmapMarker :position="position" :clickable="false" :draggable="true" @click="center=position" />
							</GmapMap>
						</v-card-text>
					</v-card-text>
					<v-card-actions>
						<v-btn @click="$router.go(-1)" color="secondary">cancel</v-btn>
						<v-btn @click="clear" color="secondary">clear</v-btn>
						<v-spacer></v-spacer>
						<v-btn :disabled="!valid" @click.prevent="submit" color="primary">submit</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-flex>
		<!-- <pre>{{jesteToSave}}</pre> -->
	</v-layout>
</template>

<script>
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { JESTE_EMPTY, JESTE_GET_BY_ID, JESTE_GET, JESTE_SAVE, JESTE_UPLOAD_IMG } from "@/modules/JesteModule";
import { GET_USER_LOCATION } from "@/modules/UserModule";
import ComboBox from "@/components/ComboBox";
// import {google} from 'vue2-google-maps'

export default {
  name: "jesteEdit",
  components: {
    ComboBox
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.getJeste(id);
    }
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(x => {
      this.google = x;
      this.initGoogle();
    });
  },
  data() {
    return {
      google: null,
      autocomplete: null,
      valid: true,
      jesteToSave: JSON.parse(JSON.stringify(this.$store.getters[JESTE_EMPTY])),
      currPlace: null,
      addressRules: [
        v => {
          return !!v || "Address is required";
        },
        v => {
          return (
            (!!v &&
              this.currPlace &&
              this.currPlace.formatted_address ===
                this.$refs.autocomplete.value) ||
            "Please type a valid address"
          );
        }
      ],
      id: "maps",
      labelText: "Search Address",
      placeholderText: "",
      types: ["address"],
      // Image upload
      imageName: "",
      imageUrl: "",
      imageFile: ""
    };
  },
  computed: {
    isEdit() {
      return !!this.jesteToSave && !!this.jesteToSave._id;
    },
    position() {
      let position = { lat: 0, lng: 0 };
      if (!this.isEdit && this.$store.getters[GET_USER_LOCATION].lat) {
        position = this.$store.getters[GET_USER_LOCATION];
      }
      if (!!this.jesteToSave.destination_loc.coordinates[0]) {
        position = {
          lat: +this.jesteToSave.destination_loc.coordinates[0],
          lng: +this.jesteToSave.destination_loc.coordinates[1]
        };
      }
      return position;
    },
    show() {
      return !!this.jesteToSave;
    }
  },
  methods: {
    getJeste(id) {
      this.$store.dispatch({ type: JESTE_GET_BY_ID, id }).then(jeste => {
        this.jesteToSave = JSON.parse(JSON.stringify(jeste));
        this.currPlace = { formatted_address: jeste.formatted_address };
      });
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        this.$store
          .dispatch({ type: JESTE_UPLOAD_IMG, image: this.imageFile })
          .then(img => {
            if (img) this.jesteToSave.img = img;
            this.$store
              .dispatch({ type: JESTE_SAVE, jesteToSave: this.jesteToSave })
              .then(_ => {
                EventBus.$emit(SNACK_MSG, {
                  text: `Jeste Saved Successfuly`,
                  bgColor: "success"
                });
                this.$router.push("/jeste");
              })
              .catch(err => {
                EventBus.$emit(SNACK_MSG, {
                  text: `Error, Couldn't Save Jeste`,
                  bgColor: "error"
                });
              });
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
        types: ["geocode"]
      });
      //   console.log("auto", this.autocomplete);
      //   console.log(google);
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
      this.autocomplete.addListener("place_changed", () => {
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
        // console.log(this.jesteToSave);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_helpers.scss";
</style>