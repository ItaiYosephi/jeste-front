<template>
	<div>
		<v-list two-line>
			<v-subheader>
				Notifications
			</v-subheader>
			<template v-for="(item, index) in notifications">

				<v-list-tile :key="item._id" avatar @click="handleClick(item.jesteId, item._id)" :class="item.isRead ? '' : 'not-read'">
					<v-list-tile-avatar>
						<img :src="item.img">
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title>{{item.txt}}
						</v-list-tile-title>
						<v-list-tile-sub-title>{{item.timestamp | dateFormat}}</v-list-tile-sub-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-divider :inset="true" v-if="index !== notifications.length - 1"></v-divider>

			</template>
		</v-list>
	</div>
</template>

<script>

import { EventBus, SET_CHAT } from '@/services/EventBusService';

import { NOTIFICATION_MARK_READ } from '@/modules/UserModule';
export default {
	props: ['notifications'],
	data() {
		return {};
	},
	methods: {
		handleClick(jesteId, notificationId) {
			this.$emit('close-list');
			this.$store.dispatch({type: NOTIFICATION_MARK_READ, id: notificationId})

			this.$router.push(`/jeste/${jesteId}`);
		}
	},
};
</script>

<style scoped>
.not-read {
	background: #edf2fa;
}

.not-read {
	background: #edf2fa;
}

</style>
