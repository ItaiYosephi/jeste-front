<template>
  <v-flex class="jeste-card-wrapper" xs12 sm4 md3>
    <v-card class="jeste-card" tile hover :to="'/jeste/' + jeste._id" height="400px">
      <v-card-media :src="jeste.imgs_url[0]" height="200px"></v-card-media>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{jeste.title}}</h3>
          <span class="grey--text">{{jeste.formatted_address}}</span>
          <div class="block-with-text" ref="desc">{{jeste.description}}</div>
        </div>
      </v-card-title>
      <v-card-actions class="actions">
        <v-btn flat color="blue" @click.prevent="" >details</v-btn>
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
        moment(+timestamp).fromNow() +", (" +moment(+timestamp).format("HH:mm:ss, DD/MM/YYYY") +")"
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

@mixin multiLineEllipsis($lineHeight: 1.2em, $lineCount: 1, $bgColor: white) {
  overflow: hidden;
  position: relative;
  line-height: $lineHeight;
  max-height: $lineHeight * $lineCount;
  text-align: justify;
  margin-right: -1em;
  padding-right: 1em;
  &:before {
    content: "...";
    position: absolute;
    right: 0;
    bottom: 0;
  }
  &:after {
    content: "";
    position: absolute;
    right: 0;
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    background: $bgColor;
  }
}

.block-with-text {
  @include multiLineEllipsis(
    $lineHeight: 1.2em,
    $lineCount: 5,
    $bgColor: white
  );
}

.jeste-card {
  display: flex;
  flex-direction: column;
}

.actions {
  margin-top: auto;
}

</style>