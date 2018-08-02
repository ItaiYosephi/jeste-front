<template>
  <v-container fluid grid-list-md>
    <v-layout wrap align-center justify-center>
      <v-flex class="container-wrapper">
        <v-card grow>
          <v-toolbar color="primary" class="white--text" flat>
            <v-toolbar-title>{{isEdit? 'Edit': 'Add'}} Jeste</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" v-model="valid"  lazy-validation>
            <v-card-text>
              <v-text-field box v-model="jesteToSave.title" label="Title" required></v-text-field>
              <v-textarea box v-model="jesteToSave.description" label="Description" hint="Few words about the jeste" required></v-textarea>
              
              <ComboBox v-model="jesteToSave.keywords"></ComboBox>
              <v-select
                box
                v-model="jesteToSave.category"
                :items="categories"
                label="Categories"
                hint="Type of the Jeste">
              </v-select>
              <ImageUpload v-model="imageFile" :imgUrl="imageUrl"/>
              <v-layout row wrap>
                <v-flex xs9>
                <v-slider
                  v-model="jesteToSave.price"
                  :max="200"
                  thumb-label
                  label="Price">
                </v-slider>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs2>
                <v-text-field
                  v-model="jesteToSave.price"
                  class="mt-0"
                  type="number">
                </v-text-field>
              </v-flex>
              </v-layout>
              
              <v-text-field box v-model="jesteToSave.formatted_address" ref="autocomplete" label="Street" @keyup.enter.prevent append-icon="search" :rules="addressRules" required>
              </v-text-field>
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
    </v-layout>
  </v-container>
</template>

<script>
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { JESTE_EMPTY, JESTE_GET_BY_ID, JESTE_GET, JESTE_SAVE, JESTE_UPLOAD_IMG, JESTE_CATEGORIES_GET } from "@/modules/JesteModule";
import { GET_USER_LOCATION } from "@/modules/UserModule";
import ComboBox from "@/components/ComboBox";
import ImageUpload from "@/components/ImageUpload";

export default {
  name: "jesteEdit",
  components: {
    ComboBox,
    ImageUpload
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
    // console.log(this.jesteToSave.img);
    
    // this.imageUrl = (this.jesteToSave.img) ? this.jesteToSave.img.url : ""
  },
  data() {
    return {
      valid: true,
      jesteToSave: JSON.parse(JSON.stringify(this.$store.getters[JESTE_EMPTY])),
      imageFile: null,
      imageUrl: null,
      categories: this.$store.getters[JESTE_CATEGORIES_GET],
      // imageUrl: null,
      // Location / street
      google: null,
      autocomplete: null,
      currPlace: null,
      addressRules: [
        v => { return !!v || "Address is required"; },
        v => { 
          return ( (!!v && this.currPlace && this.currPlace.formatted_address === this.$refs.autocomplete.value) || "Please type a valid address" );
        }
      ],
      id: "maps",
    };
  },
  computed: {
    // imageUrl() {
      
    //   if (this.jesteToSave.img) {
    //     console.log(this.jesteToSave.img);
    //     return (this.jesteToSave.img.url) ? this.jesteToSave.img.url : "";
    //   }
    //   else return "";
    // },
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
        this.imageUrl = this.jesteToSave.img.url;
        console.log('r', this.imageUrl);
        
        this.currPlace = { formatted_address: jeste.formatted_address };
      });
    },
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        this.$store.dispatch({ type: JESTE_UPLOAD_IMG, image: this.imageFile })
          .then(img => {
            if (img) this.jesteToSave.img = img;
            this.$store
              .dispatch({ type: JESTE_SAVE, jesteToSave: this.jesteToSave })
              .then(_ => {
                EventBus.$emit(SNACK_MSG, { text: `Jeste Saved Successfuly`, bgColor: "success"
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
      var el = this.$refs.autocomplete.$el.children[0].children[0].children[0].children[1];
      this.autocomplete = new this.google.maps.places.Autocomplete(el, {
        types: ["geocode"]
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
      this.autocomplete.addListener("place_changed", () => {
        this.currPlace = this.autocomplete.getPlace();
        this.jesteToSave.address_components = this.currPlace.address_components;
        this.jesteToSave.formatted_address = this.currPlace.formatted_address;
        this.jesteToSave.destination_loc.coordinates.splice( 0, 1, +this.currPlace.geometry.location.lat()
        );
        this.jesteToSave.destination_loc.coordinates.splice( 1, 1, +this.currPlace.geometry.location.lng()
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>