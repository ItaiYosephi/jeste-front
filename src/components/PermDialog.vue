<template>
    <v-dialog v-model="displayDialog" max-width="400" persistent>
		<v-card>
            <v-card-title class="headline grey lighten-2">No Permission!</v-card-title>
            <v-card-text>
                Oh Oops... <br/>
                It's Seems like you don't have permission to this page. <br/>
				<span v-if="!currUser">Try to login or signup</span>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="info" flat @click="clicked">
                    back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="!currUser" color="success" flat if :to="'/login'">
                    signup | login
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { USER_CONNECTED } from "@/modules/UserModule";

export default {
  props: {
    displayDialog: Boolean
  },
  computed: {
    currUser() {
      return this.$store.getters[USER_CONNECTED];
    }
  },
  methods: {
    clicked() {
      this.$router.go(-1);
    }
  }
};
</script>

<style>
</style>
