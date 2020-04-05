<template>
<div class="flex-none p-3" @click="$emit('viewMatch', id)">
  <img :src="require(`@/assets/images/profile/${image}`)" 
        class="cursor-pointer h-16 w-16 object-cover rounded-full mb-2
                lg:rounded-full"/>
  <!-- <img :src="url" TODO: Bring back
        class="cursor-pointer h-12 w-12 object-cover rounded-full mb-2
                lg:rounded-full" /> -->
  <h1 class="text-dark-grey text-sm font-bold">
    {{ name }}
  </h1>
</div>
</template>

<script>
import config from '@/config';

export default {
  props: { 
    'image': String,
    'name': String,
    'id': String
  },

  computed: {
    url: function() {
      return this.image ? `${config.SERVER_URL}/images/${this.image}` : '';
    }
  }
}
</script>
2`