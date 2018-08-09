<template>
    <v-list two-line class="chat-list">
        <v-subheader>
         Chats
        </v-subheader>
        <template v-for="(item, index) in chatList">

            <v-list-tile :key="item.friendId" avatar @click="" class="popo">
                <v-list-tile-avatar>
                    <img :src="item.chatUser.img.secure_url">
                </v-list-tile-avatar>

                <v-list-tile-content>
                    <v-list-tile-title>{{item.chatUser.details.firstName}} {{item.chatUser.details.lastName}}
                        <span v-if="item.unReadCount > 0">({{item.unReadCount}})</span></v-list-tile-title>
                    <v-list-tile-sub-title>aaaaaaaaaaaaaaaaaaaaaa</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider :inset="true"></v-divider>

        </template>
    </v-list>
</template>

<script>
export default {
	props: ['chatList'],
	data() {
		return {
			items: [
				{ header: 'Today' },
				{
					avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
					title: 'Brunch this weekend?',
					subtitle:
						'lorem   ,bdsc;ljsdsd,fnclhndvsd sdlfslk nnnnn nnfhsl'
				},
				{
					avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
					title:
						'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
					subtitle:
						'lorem   ,bdsc;ljsdsd,fnclhndvsd sdlfslk nnnnn nnfhsl'
				},
				{
					avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
					title: 'Oui oui',
					subtitle:
						'lorem   ,bdsc;ljsdsd,fnclhndvsd sdlfslk nnnnn nnfhsl'
				},
				{
					avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
					title: 'Birthday gift',
					subtitle:
						'lorem   ,bdsc;ljsdsd,fnclhndvsd sdlfslk nnnnn nnfhsl'
				},
				{
					avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
					title: 'Recipe to try',
					subtitle:
						'lorem   ,bdsc;ljsdsd,fnclhndvsd sdlfslk nnnnn nnfhsl'
				}
			]
		};
	}
};
</script>

<style scoped>
.chat-list {
	background: white;
	position: fixed;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	max-width: 100%;
}
.not-read {
	background: #edf2fa;
}
</style>
