<template>
<v-container fluid grid-list-md>
	<v-layout justify-center wrap class="container-wrapper">
		<v-flex xs12 lg6>
			<Login/>
		</v-flex>
    <v-flex xs12 lg6>
			<SignUp/>
		</v-flex>
	</v-layout>
</v-container>
</template>

<script>
import SignUp from "@/components/users/SignUp";
import Login from "@/components/users/Login";
import { UPDATE_TITLE } from '@/store';


export default {
  components: {
    SignUp,
    Login
	},
	created() {
this.$store.commit({ type: UPDATE_TITLE, title: 'Jeste - Login' });

	}
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/_helpers.scss";
.container-wrapper {
	margin: 0 auto !important;
}
</style>