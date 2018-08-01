<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap fill-height v-if="jeste">
			<ChatCmp v-if="user" :isReqUser="canEdit" :jeste-id="jeste._id" :req-user-id="jeste.req_user_id" :curr-user="user" class="popo"></ChatCmp>

			<v-flex xs12 sm6>
				<v-card height="100%" class="jeste-details-card" hover>
					<v-card-title primary-title>
						<div>
							<div class="headline mb-2">{{jeste.title}}</div>
							<div class="grey--text mb-2">{{jeste.formatted_address}}</div>
							<div>{{jeste.description}}</div>
						</div>
					</v-card-title>
					<v-card-actions>
						<v-btn flat color="blue" @click.prevent="respond">Jeste It!</v-btn>
						<v-btn v-if="canEdit" flat :to="`/jeste/${jeste._id}/edit`">Edit</v-btn>
						<v-btn v-if="canEdit" flat @click.stop="dialog = true">Delete</v-btn>

						<v-spacer></v-spacer>

					</v-card-actions>
				</v-card>
			</v-flex>

			<v-flex xs12 sm6>
				<v-card hover height="100%">
					<v-card-media v-if="jeste.img" :src="jeste.img.url" height="400px">
						<!-- <v-container fill-height fluid pa-2>
							<v-layout fill-height>
								<v-flex xs12 align-end flexbox>
									<span class="headline white--text" v-text="jeste.title"></span>
								</v-flex>
							</v-layout>
						</v-container> -->
					</v-card-media>
				</v-card>
			</v-flex>

			<v-flex xs12>
				<v-card hover>
					<v-card-text>
						<GmapMap :center="position" v-if="jeste.destination_loc" :zoom="15" map-type-id="terrain" style="width: 100%; height: 300px">
							<GmapMarker :position="position" :clickable="false" :draggable="true" @click="center=position" />
						</GmapMap>
					</v-card-text>
				</v-card>
			</v-flex>
			<v-dialog v-model="dialog" max-width="290" class="warning">
				<v-card>
					<v-card-title class="headline grey lighten-2">Are you sure?</v-card-title>

					<v-card-text>
						Once deleted, there's no way back...
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="green darken-1" flat="flat" @click="dialog = false">
							Cancel
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="error" flat="flat" @click="deleteJeste()">
							Delete
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

		</v-layout>

	</v-container>

</template>

<script>
import ChatCmp from '@/components/ChatCmp'
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { JESTE_GET, JESTE_GET_BY_ID, JESTE_DELETE } from "@/modules/JesteModule";
import { USER_CONNECTED } from "@/modules/UserModule";

export default {
  name: "jesteDetails",
  data() {
    return {
      jeste: {},
      dialog: false
    };
  },
  created() {
		this.getJeste();
		
	},
	mounted() {

	},
  methods: {
    getJeste() {
      let id = this.$route.params.id;
      let jeste = this.$store.getters[JESTE_GET](id);
      if (!jeste) {
        this.$store.dispatch({ type: JESTE_GET_BY_ID, id })
          .then(jeste => (this.jeste = jeste));
      } else {
        this.jeste = jeste;
      }
    },
    deleteJeste() {
      this.dialog = false;
      this.$store
        .dispatch({ type: JESTE_DELETE, id: this.jeste._id })
        .then(_ => {
          EventBus.$emit(SNACK_MSG, { text: `Jeste Deleted Successfully`, bgColor: "success" });
          this.$router.push("/");
        });
		},
		respond() {
			this.$socket.emit('respondJeste', {jeste: this.jeste, resUserId: this.user._id});
		}
  },
  computed: {
    position() {
      if (this.jeste.destination_loc) {
        return {
          lat: +this.jeste.destination_loc.coordinates[0],
          lng: +this.jeste.destination_loc.coordinates[1]
        };
      }
    },
    canEdit() {
      return ( !this.jeste.ended_at &&
        this.user &&
        this.user._id === this.jeste.req_user_id );
		},
		user() {

			return this.$store.getters[USER_CONNECTED]
		}
  },
  components: {
	  ChatCmp
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";

.jeste-details-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.popo {
	z-index: 10000000000000;
}
</style>