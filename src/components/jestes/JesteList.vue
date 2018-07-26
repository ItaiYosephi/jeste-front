<template>

    <ul class="jeste-list clean-list flex">
		<v-layout>
            <router-link tag="li"
                        v-for="jeste in jestes" 
                        :key="jeste._id"
                        :to="'/jeste/' + jeste._id">
                <JestePreview :jeste="jeste" />
            </router-link>
		</v-layout>
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
@import '../../assets/styles/_helpers.scss';

// .jeste-list > li {
//     width: 300px;
//     margin: 10px;
//     border: 1px solid $mainColor;
//     background: $bgColor;
// }

</style>
