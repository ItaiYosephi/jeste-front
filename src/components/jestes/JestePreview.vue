<template>
		<v-flex xl3 ma-1 class="jeste-card-wrapper">
        <v-card class="jeste-card" tile hover :to="'/jeste/' + jeste._id">
            <v-card-media :src="jeste.imgs_url[0]" height="200px"></v-card-media>
			<v-card-title primary-title>
				<div>
					<h3 class="headline mb-0">{{jeste.title}}</h3>
					<div>{{jeste.description}}</div>
				</div>
			</v-card-title>
			<v-card-actions>
				<v-btn flat color="blue" @click.prevent="">details</v-btn>
				<v-btn flat color="blue" @click.prevent="">Jeste It!</v-btn>
			</v-card-actions>
		</v-card>
    </v-flex>
</template>

<script>
import moment from "moment";

export default {
  name: "jestePreview",
  props: {
    jeste: Object
  },
  computed: {
    reqUser() {
      return this.jeste.req_user.details;
    }
  },
  filters: {
    dateFormat(timestamp) {
      return (
        moment(+timestamp).fromNow() +
        ", (" +
        moment(+timestamp).format("HH:mm:ss, DD/MM/YYYY") +
        ")"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_vars.scss";

.jeste-card-wrapper {
  max-width: 400px;
}
</style>