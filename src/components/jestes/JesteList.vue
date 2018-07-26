<template>
    <v-layout>
        <JestePreview
            v-for="jeste in jestes"
            :key="jeste._id"
            :to="'/jeste/' + jeste._id"
            :jeste="jeste" />
    </v-layout>
     <!-- <v-flex ma-2
            v-for="jeste in jestes" 
            :key="jeste._id"
            :to="'/jeste/' + jeste._id">
            <JestePreview :jeste="jeste" />
        </v-flex> -->
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

.wrapper {
    // flex-wrap: wrap;
    padding: 10px;
}

// .jeste-list > li {
//     width: 300px;
//     margin: 10px;
//     border: 1px solid $mainColor;
//     background: $bgColor;
// }

</style>
