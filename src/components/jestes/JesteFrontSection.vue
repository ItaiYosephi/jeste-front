<template>
    <section class="content-wrapper">
        <v-layout column wrap justify-center align-center class="main-content">
            <div class="header">jeste</div>
            <div class="sub-header">help others | get help</div>
            <v-spacer></v-spacer>
            <!-- <div class="about">JESTE is a new way to help your communiuty in small works or jobs, and in return
                get help when you need it</div> -->
            <v-spacer></v-spacer>
            <v-layout row wrap justify-center class="stats">
                <div class="stat">
                    <div>{{jestesStats[0] + jestesStats[1] + jestesStats[2] + jestesStats[3]}}</div>
                    <div class="desc">total jestes</div>
                </div>
                <div class="stat">
                    <div>{{jestesStats[3]}}</div>
                    <div class="desc">completed jestes</div>
                </div>
                <div class="stat">
                    <div>{{jestesStats[0] + jestesStats[1] + jestesStats[2]}}</div>
                    <div class="desc">active jestes</div>
                </div>
            </v-layout>
            <v-layout row wrap justify-center mt-2>
                <v-btn large color="primary" @click="$vuetify.goTo($refs.listRecent, {easeing: 'easeInQuad', offset: -100, duration: 600})">do
                    a jeste</v-btn>
                <v-btn large color="primary" to="/jeste/edit">ask for jeste</v-btn>
            </v-layout>
            <v-spacer></v-spacer>
        </v-layout>
    </section>
</template>

<script>
export default {
	name: 'jesteFrontSection',
	props: {
		jestesStats: Object
	}
};
</script>

<style lang="scss" scoped>

.content-wrapper {
    height: calc(100vh - 48px);
	@media (min-width: 960px) {
		height: calc(100vh - 64px);
	}
	background: rgba(3, 20, 36, 0.5);
}

.main-content {
	height: 100%;
	color: white;
	.header {
		text-transform: uppercase;
		font-size: 4.8em;
		letter-spacing: 1.5px;
		font-family: 'Open Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana,
			sans-serif;
	}
	.sub-header {
		font-family: 'Open Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana,
			sans-serif;
		margin-top: -10px;
		font-size: 1.15em;
		letter-spacing: 1.1px;
		text-transform: uppercase;
	}
	.about {
		padding: 10px;
		text-align: center;
		font-size: 1.2em;
	}
	.stats {
		text-transform: uppercase;
		font-size: 2.25em;
		letter-spacing: 1.2px;
		font-family: 'Open Sans', 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana,
			sans-serif;
		.stat {
			padding: 0 10px;
			display: flex;
			flex-flow: column wrap;
			justify-content: center;
			align-content: center;
			align-items: center;
			.desc {
				text-align: center;
				font-size: 0.5em;
			}
		}
		.stat:not(:last-child) {
			border-right: 2px solid white;
		}
	}
	@media (min-width: 600px) {
		.header {
			font-size: 6.25em;
			letter-spacing: 2px;
		}
		.sub-header {
			font-size: 1.5em;
			letter-spacing: 1.5px;
		}
	}
}

</style>
