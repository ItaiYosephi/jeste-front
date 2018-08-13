<template>
    <router-link :to="`/user/${user._id}`">
        <div class="avatar-wrapper">
            <v-avatar size="60px" color="grey lighten-4">
                <img :src="user.img.secure_url" alt="avatar" :title="user.details.firstName">
            </v-avatar>
            <div class="name black--text">{{user.details.firstName}} {{user.details.lastName}}</div>
        </div>
    </router-link>
</template>

<script>
export default {
    props: {
        user: Object
    }
}
</script>

<style lang="scss" scoped>

.avatar-wrapper {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
}

.name {
    margin-left: 5px;
    text-align: center;
}

</style>