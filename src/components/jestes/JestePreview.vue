<template>
		<v-flex ma-2>
				<v-card hover :to="'/jeste/' + jeste._id">
						<v-card-media :src="jeste.imgs_url[0]" height="200px"></v-card-media>
						<v-card-title primary-title>
								<div>
										<h3 class="headline mb-0">{{jeste.title}}</h3>
										<div>{{jeste.description}}</div>
								</div>
						</v-card-title>
						<v-card-actions>
								<v-btn flat color="blue" @click.prevent="">More details</v-btn>
								<v-btn flat color="blue" @click.prevent="">Jeste It!</v-btn>
						</v-card-actions>
				</v-card>
		</v-flex>
</template>

<script>
import moment from 'moment'

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
          return moment(+timestamp).fromNow() + ', (' + moment(+timestamp).format('HH:mm:ss, DD/MM/YYYY') + ')';
      }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_vars.scss";

// .jeste-preview {
//   padding: 0;
//   color: $mainColor;
// }

// .jeste-preview.text {
//     padding: 5px;
// }

// img {
//   display: block;
//   max-width: 100%;
//   height: auto;
// }
</style>