<template>
<div class="p-0 relative" :class="imgMarginClass">
  <img :src="url" :id="idName" 
    class="rounded-lg cursor-pointer object-cover" 
    :class="shadowClass"
    @mouseover="hover = true" 
    @mouseleave="hover = false"
    @click="$emit('viewImage', url)" />
    
  <img src="@/assets/images/close.svg" id="close" v-if="isImage"
    class="cursor-pointer grow" 
    :class="closeClass"
    @click="$emit('removeImage', url)" />
</div>
</template>s

<style src="@/App.css"></style>
<style src="@/assets/stylesheets/component-styles/picture-form.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/settings-picture-form.css" scoped></style>
<style src="@/assets/stylesheets/util/transitions.css" scoped></style>
<style scoped>
#close {
  position: absolute;
  top: -6px;
  right: -6px;
  margin: 0;  
  padding: 0;
  z-index: 1001;
}

#close:hover {
  display: block;
}
</style>

<script>
export default {
  data() {
    return {
      hover: false
    }
  },
  props: { 
    'url': String,
    'idName': String,
    'isImage': Boolean,
    'atRegistration': Boolean
  },

  computed: {
    closeClass() {
      return {
        hidden: !this.hover,
        block: this.hover
      }
    },

    shadowClass() {
      return {
        'shadow-md': this.isImage,
        '': !this.isImage,
      }
    },

    imgMarginClass() {
      return {
        'my-5': this.atRegistration,
        '': !this.atRegistration,
      }
    }
  }
}
</script>