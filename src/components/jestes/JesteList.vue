<template>
    <ul class="jeste-list">
        <router-link tag="li"
                    v-for="jeste in jestes" 
                    :key="jeste._id"
                    :to="'/jeste/' + jeste._id">
            <JestePreview :jeste="jeste" />
        </router-link>
    </ul>
</template>

<script>
import JestePreview from './JestePreview';

export default {
    name: 'jesteList',
    components: {
        JestePreview
    },
    props: {
        jestes: Array
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_vars.scss';

</style>
