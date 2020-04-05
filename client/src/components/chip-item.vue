<template>
<div id="chip" class="text-md bg-pink-200 rounded-full px-3 mx-1">
  {{ val }}
  <img src="@/assets/images/x-plain.svg" class="text-sm pl-1 pb-1 inline cursor-pointer" 
    @click="$emit('close', index)" />
</div>
</template>

<style scoped>
#chip {
  width: max-content;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}
</style>

<script>
export default {
  name: 'chipItems',
  props: {
    val: String,
    index: Number,
  },
}
</script>