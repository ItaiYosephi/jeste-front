<template>
    <section class="jeste-preview">
        jeste-preview
        {{jeste}}
    </section>
</template>

<script>
export default {
    name: 'jestePreview',
    props: {
        jeste: Object
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/_vars.scss';

.jeste-preview {
    color: $bgColor;
}
</style>
