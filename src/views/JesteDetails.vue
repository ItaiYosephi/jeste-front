<template>
    <section class="jeste-details">
      jeste-details

      {{jeste}}
    </section>
</template>

<script>
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
      var id = this.$route.params.id;
      var jeste = this.$store.getters.getJeste(id)


      if (!jeste) {
        this.$store.dispatch({type: 'getJesteById', id} )
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