<template>
  <v-container class="list-container" fluid grid-list-md>
    <v-layout row wrap fill-height v-if="jestes">
      <JestePreview v-for="jeste in jestes" :key="jeste._id" :to="'/jeste/' + jeste._id" :jeste="jeste" />
    </v-layout>
  </v-container>
</template>

<script>
import JestePreview from './JestePreview';

export default {
	name: 'jesteList',
	components: {
		JestePreview
	},
	props: ['jestes']
};
</script>