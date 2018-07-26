<template>
    <section class="jeste-details">
      jeste-details

      {{jeste}}
    </section>
</template>

<script>
import { JESTE_GET, JESTE_GET_BY_ID} from '@/modules/JesteModule'
export default {
  name: "jesteDetails",
  data() {
    return {
      jeste: {}
    }
  },
  created() {
    this.getJeste()

  },
  methods: {
    getJeste() {
      let id = this.$route.params.id;
      let jeste = this.$store.getters[JESTE_GET](id)
      if (!jeste) {
        this.$store.dispatch({type: JESTE_GET_BY_ID, id} )
          .then(jeste => this.jeste = jeste)
      } else {
        this.jeste = jeste;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';

.jeste-details {
  color: $mainColor;
}
</style>