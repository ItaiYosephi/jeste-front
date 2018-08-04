<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap fill-height v-if="jeste">
			<ChatCmp v-if="showChat" :jeste-id="jeste._id" :req-user-id="jeste.req_user_id" :res-user-id="jeste.res_user_id" :user-id="user._id"
			 class="chat-cmp">
			</ChatCmp>

			<v-flex xs12 sm6>
				<div class="load-wrapper" v-if="isLoading">
					<LoadingCmp/>
				</div>
				<v-card v-else height="100%" class="jeste-details-card" hover>

					<v-card-title primary-title>
						<v-layout row justify-space-between>
							<v-flex>
								<div class="headline mb-2">{{jeste.title}}</div>
								<div class="grey--text mb-2">{{jeste.formatted_address}}</div>
								<div class="desc">{{jeste.description}}</div>
							</v-flex>
							<v-flex v-if="reqUser" xs2 ml-4>
								<router-link :to="`/user/${reqUser._id}`">
									<v-avatar size="50px" color="grey lighten-4">
										<img :src="reqUser.img.url" alt="avatar">
									</v-avatar>
									<div class="grey--text">{{reqUser.details.firstName}} {{reqUser.details.lastName}}</div>
								</router-link>
							</v-flex>
						</v-layout>
					</v-card-title>

					<v-card-actions>
						<v-btn v-if="canEdit" flat color="green" :to="`/jeste/${jeste._id}/edit`">Edit</v-btn>
						<v-btn v-if="canEdit" flat color="error" @click.stop="dialog = true">Delete</v-btn>
						<v-spacer></v-spacer>
						<v-btn v-if="!canEdit && user && !jeste.res_user_id" flat color="blue" @click.prevent="respond">Jeste It!</v-btn>
					</v-card-actions>

				</v-card>
			</v-flex>

			<v-flex xs12 sm6>
				<v-card hover height="100%">
					<div class="load-wrapper" v-if="isLoading">
						<LoadingCmp/>
					</div>
					<v-card-media v-else-if="jeste.img" :src="jeste.img.url" height="400px">
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
						<v-btn color="green darken-1" flat @click="dialog = false">
							Cancel
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="error" flat @click="deleteJeste()">
							Delete
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

		</v-layout>
	</v-container>
</template>

<script>
import LoadingCmp from "@/components/LoadingCmp";
import ChatCmp from "@/components/ChatCmp";
import { EventBus, SNACK_MSG } from "@/services/EventBusService";
import { JESTE_GET, JESTE_GET_BY_ID, JESTE_DELETE, JESTE_IS_LOADING } from "@/modules/JesteModule";
import { USER_CONNECTED, USER_GET_BY_ID } from "@/modules/UserModule";

export default {
  name: "jesteDetails",
  components: {
    ChatCmp,
    LoadingCmp
  },
  created() {
		this.getJeste().then(this.getUser);
  },
  data() {
    return {
      jeste: {},
      dialog: false,
      reqUser: null
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters[JESTE_IS_LOADING];
    },
    position() {
      if (this.jeste.destination_loc) {
        return {
          lat: +this.jeste.destination_loc.coordinates[0],
          lng: +this.jeste.destination_loc.coordinates[1]
        };
      }
    },
    canEdit() {
      return ( !this.jeste.ended_at && this.user &&
        this.user._id === this.jeste.req_user_id );
    },
    user() {
      return this.$store.getters[USER_CONNECTED];
    },
    showChat() {
      return ( !!this.user && !!this.jeste.res_user_id &&
        (this.user._id === this.jeste.res_user_id || this.user._id === this.jeste.req_user_id)
      );
    }
  },
  methods: {
    getJeste() {
      return this.$store.dispatch({ type: JESTE_GET_BY_ID, id: this.$route.params.id })
        .then(jeste => this.jeste = jeste);
    },
    deleteJeste() {
      this.dialog = false;
      this.$store
        .dispatch({ type: JESTE_DELETE, id: this.jeste._id })
        .then(_ => {
          EventBus.$emit(SNACK_MSG, {
            text: `Jeste Deleted Successfully`,
            bgColor: "success"
          });
          this.$router.push("/");
        });
    },
    respond() {
      console.log("User:", this.user);

      this.jeste.res_user_id = this.user._id;
      this.$socket.emit("jesteResponded", { jeste: this.jeste });
    },
    getUser() {
      this.$store.dispatch({ type: USER_GET_BY_ID, id: this.jeste.req_user_id })
        .then(user => this.reqUser = user);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";

a {
  text-decoration: none;
}
.v-card--hover {
  cursor: default;
}
.jeste-details-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.chat-cmp {
  z-index: 10;
}
.load-wrapper {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>