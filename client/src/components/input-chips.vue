<template>
<div id="container" class="pr-2 flex flex-wrap items-center rounded-md overflow-auto">
  <div class="flex flex-0 items-center" v-for="(chip, index) in chips" :key="index">
    <chip-item :val="chip" :index="index" @close="close" />
  </div>
  <input id="text" class="flex-auto pl-2" v-model="text"
    @keydown.delete="deleteChip"
    @keypress.enter="addChip" />
</div>
</template>

<style scoped>
#text {
  width: 10px;
  background-color: #FAFAFA;
  border-radius: 6px;
  border: none;
  outline: none;
}

#container {
  background-color: #FAFAFA;
  border: 1px solid #EAEDF4;
}
</style>

<script>
import ChipItem from "./chip-item.vue";

export default {
  name: "inputChips",

  data() {
    return {
      text: ""
    };
  },

  components: {
    ChipItem
  },

  props: {
    chips: Array,
    wordLimit: {
      type: Number,
      default: 15
    },
    limit: {
      type: Number,
      default: -1
    }
  },

  computed: {
    underLimits() {
      return this.limits === -1 || this.chips.length < this.limit;
    }
  },

  methods: {
    close(index) {
      this.chips.splice(index, 1);
    },

    addChip() {
      if (this.underLimits) {
        if (this.text.trim() !== "") {
          this.chips.push(this.text);
          this.text = "";
        }
      } else {
        alert("cannot add more");
      }
    },

    deleteChip() {
      if (this.text === "") this.chips.pop();
    }
  },

  watch: {
    text(text) {
      text = text.trim();
      if (text >= this.wordLimit) text = text.substring(0, this.wordLimit);
      this.text = text;
    }
  }
};
</script>