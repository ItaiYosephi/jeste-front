<template>
    <section class="about">
        <h1>This is an about page</h1>
    </section>
</template>

<script>
import {UPDATE_TITLE} from '@/store'

export default {
    created() {
        this.$store.commit({type: UPDATE_TITLE, title: 'Jeste - About'})
    }
}
</script>

<style>

</style>
