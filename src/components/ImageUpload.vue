<template>
    <v-flex xs12 class="text-center">
        <img :src="imageUrl" v-if="imageUrl" height="150" />
        <v-text-field
            box
            label="Select Image"
            v-model="imageName"
            append-icon="attach_file"
            @click="pickFile"
            @focus="pickFile"
            @click:append="pickFile">
        </v-text-field>
        <input
            type="file"
            style="display: none"
            ref="image"
            accept="image/*"
            @change="onFilePicked">
    </v-flex>
</template>

<script>
export default {
  name: "imageUpload",
  props: {
    imgUrl: String
  },
  data() {
    return {
      imageName: "",
      imageUrl: (this.imgUrl) ? this.imgUrl : "",
      imageFile: ""
    };
  },
  watch: {
    imgUrl() {
      this.imageUrl = (this.imgUrl) ? this.imgUrl : ""
    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) return;
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          this.$emit("input", this.imageFile);
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    }
  }
};
</script>

<style>
</style>
