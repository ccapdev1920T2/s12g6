<template>
<div class="flex-none p-3" @click="$emit('viewMatch')">
  <img :src="dpUrl"
        class="cursor-pointer h-12 w-12 object-cover rounded-full mb-2
                lg:rounded-full" />
  <h1 class="text-dark-grey text-sm font-bold">
    {{ name }}
  </h1>
</div>
</template>

<script>
import config from '@/config';

export default {
  props: { 
    'name': String,
    'id': String,
    'dp': String
  },

  computed: {
    dpUrl() {
      return this.id && this.dp ? `${config.SERVER_URL}/images/users/${this.id}/${this.dp}` : '';
    }
  }
}
</script>
