<template>
	<section class="jeste-edit">
		<h1>{{isEdit? 'Edit': 'Add'}} Jeste</h1>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-text-field v-model="jesteToSave.title" label="title" required></v-text-field>
			<v-text-field v-model="jesteToSave.description" label="description" required></v-text-field>
			<ComboBox v-model="jesteToSave.keywords"></ComboBox>

			

			<v-btn :disabled="!valid" @click="submit">
				submit
			</v-btn>
			<v-btn @click="clear">clear</v-btn>
		</v-form>
		<pre>
	{{jesteToSave}}
		</pre>
	</section>
</template>

<script>
import { JESTE_EMPTY, JESTE_GET_BY_ID, JESTE_GET } from "@/modules/JesteModule";
import ComboBox from '@/components/ComboBox'

export default {
  name: "jesteEdit",
  data() {
    return {
      valid: true,

      jesteToSave: {},

    };
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.getJeste(id);
    } else {
      this.jesteToSave = this.$store.getters[JESTE_EMPTY];
    }
  },
  methods: {
    getJeste(id) {
      let jeste = this.$store.getters[JESTE_GET](id);
      if (!jeste) {
        this.$store
          .dispatch({ type: JESTE_GET_BY_ID, id })
          .then(
            jeste => (this.jesteToSave = JSON.parse(JSON.stringify(jeste)))
          );
      } else {
        this.jesteToSave = JSON.parse(JSON.stringify(jeste));
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        console.log("valid");
      }
    },
    clear() {
      this.$refs.form.reset();
    },

  },
  
  computed: {
    isEdit() {
      return !!this.jesteToSave && !!this.jesteToSave.id;
    }
  },
  components: {
	  ComboBox
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_vars.scss";

.jeste-edit {
  color: $mainColor;
}
</style>