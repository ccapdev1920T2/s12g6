<template>
<div id="hoverText" class="bg-white shadow-md p-2">
  <p class="text-sm">To add a like or dislike, type a word or phrase then press Enter</p>
</div>  
</template>

<style src="@/assets/stylesheets/util/transitions.css"></style>
<style scoped>
#hoverText {
  position: absolute;
  top: -48px;
  left: 48px;
  height: auto;
  width: max-content;
  z-index: 10;
  border: 1px solid #f8f8f8;
  border-radius: 6px;
}
</style>

<script>
</script>
