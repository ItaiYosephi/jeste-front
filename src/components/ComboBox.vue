<template>
	<v-combobox box v-model="model" :filter="filter" :hide-no-data="!search" :items="items" :search-input.sync="search" hide-selected label="Enter Keywords" multiple small-chips solo>
		<template slot="no-data">
			<v-list-tile>
				<span class="subheading">Create</span>
				<v-chip :color="`${colors[nonce - 1]} lighten-3`" label small>
					{{ search }}
				</v-chip>
			</v-list-tile>
		</template>
		<template v-if="item === Object(item)" slot="selection" slot-scope="{ item, parent, selected }">
			<v-chip :color="`${item.color} lighten-1`" :selected="selected" label small>
				<span class="pr-2">
					{{ item.text }}
				</span>
				<v-icon small @click="parent.selectItem(item)">close</v-icon>
			</v-chip>
		</template>
		<template slot="item" slot-scope="{ index, item, parent }">
			<v-list-tile-content>
				<v-text-field v-if="editing === item" v-model="editing.text" autofocus flat background-color="transparent" hide-details solo @keyup.enter="edit(index, item)"></v-text-field>
				<v-chip v-else :color="`${item.color} lighten-3`" dark label small>
					{{ item.text }}
				</v-chip>
			</v-list-tile-content>
			<v-spacer></v-spacer>
			<v-list-tile-action @click.stop>
				<v-btn icon @click.stop.prevent="edit(index, item)">
					<v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
				</v-btn>
			</v-list-tile-action>
		</template>
	</v-combobox>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      activator: null,
      attach: null,
      colors: ["green", "purple", "indigo", "cyan", "teal", "orange", "blue", "yellow", "red"],
      editing: null,
      index: -1,
      items: [
        { header: "Select a keyword or create one" },
        {
          text: "Foo",
          color: "blue"
        },
        {
          text: "Bar",
          color: "red"
        }
      ],
      nonce: 1,
      menu: false,
      model: [],
      x: 0,
      search: null,
      y: 0
    };
  },
  computed: {
    isEdit() {
      return !!this.jesteToSave && !!this.jesteToSave.id;
    }
  },
  methods: {
    edit(index, item) {
      if (!this.editing) {
        this.editing = item;
        this.index = index;
      } else {
        this.editing = null;
        this.index = -1;
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = val => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    }
  },
  watch: {
    nonce(num) {
      if (num > this.colors.length) this.nonce = 1;
    },
    value(items) {
      if (!items || this.model.length > 0) return;

      this.model = items.map(item => {
        return {
          text: item,
          color: this.colors[this.nonce - 1]
        };
      });
      this.nonce++;
    },
    model(val, prev) {
      if (val.length === prev.length) return;

      this.model = val.map(v => {
        if (typeof v === "string") {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          };
          this.nonce++;
          this.items.push(v);
        }

        return v;
      });
      var txts = this.model.map(item => item.text);
      this.$emit("input", txts);
    }
  }
};
</script>

<style>
</style>
