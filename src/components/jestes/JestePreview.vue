<template>
    <section class="jeste-preview">
        <img :src="jeste.imgs_url[0]" />
        <div class="text">
            {{reqUser.firstName}} {{reqUser.lastName}}, {{reqUser.Age}}
            <br/>
            Destination: {{jeste.destination_loc}}
            <br/>
            Starting from:
            <br/>
            {{jeste.time_frame.from | dateFormat}}
            <br/>
            Deadline:
            <br/>
            {{jeste.time_frame.until | dateFormat}}
            <br/>
            {{jeste.description}}
            <br/>
            Tags: <span v-for="keyword in jeste.keywords">{{keyword}}, </span>
        </div>
    </section>
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
          console.log(timestamp);
          return moment(+timestamp).fromNow() + ', (' + moment(+timestamp).format('HH:mm:ss, DD/MM/YYYY') + ')';
      }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/_vars.scss";

.jeste-preview {
  padding: 0;
  color: $mainColor;
}

.jeste-preview.text {
    padding: 5px;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>