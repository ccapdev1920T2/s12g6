<template>
<li id="chatItem" class="items-center" @click="switchChat" 
  @mouseenter="cog = true"
  @mouseleave="cog = false">

  <div class="flex items-center p-3 px-4 cursor-pointer">
    <div class="h-16 w-16">
      <img class="h-16 w-16 rounded-full object-cover" :src="dpUrl">
    </div>

    <div v-if="!settings" class="w-1/2 m-3 flex flex-col truncate">
      <div class="font-bold text-lg">{{ chat[chat.match] }}</div>
      <p class="text-sm truncate" :class="{ 'font-bold': !read }">
        {{ chatText(chat.messages[chat.messages.length - 1]) }}
      </p>
    </div>

    <!-- Settings -->
    <font-awesome-icon v-if="!settings" 
      :style="{ opacity: cog ? 1 : 0 }"
      id="cog"
      class="flex-1 text-lg"
      icon="cog" @click="showSettings"/>
    
    <transition name="slide">
      <div v-if="settings" id="chatOptions" class="flex flex-1">
        <div class="p-5 py-6">
          <font-awesome-icon
            class="flex-1 mr-1"
            size="lg"
            :style="{ color: 'gray' }"
            :transform="{ rotate: 180 }"
            icon="angle-left" @click="hideSettings"/>
        </div>

        <div id="trash" class="option-icon bg-pink-300">
          <font-awesome-icon
            class="flex-1 text-white m-auto"
            icon="trash" @click="$emit('deleteChatAndUnmatch')"/>
        </div>

        <div id="report" class="option-icon bg-red-500">
          <font-awesome-icon
            class="flex-1 m-auto"
            size="lg"
            :style="{ color: 'white' }"
            icon="flag" @click="$emit('report')"/>
        </div>
      </div>
    </transition>
  </div>
</li>
</template>

<style src="@/assets/stylesheets/util/transitions.css"></style>
<style scoped>
#chatItem:hover {
  background-color: #97878B10;
}

#cog {
  color: #AAAAAA;
}

#chatOptions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.option-icon {
  max-height: 60px;
  max-width: 60px;
  height: 60px;
  width: 60px;  
  display: flex;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(150px);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease-in-out;
}
</style>
<script>
import config from '@/config';

export default {
  data() {
    return {
      settings: false,
      switching: true,
      cog: false
    }
  },

  props: {
    chat: {
      type: Object
    },
    dp: String,
    read: Boolean,
  },

  methods: {
    switchChat() {
      if (!this.settings && this.switching) {
        this.$emit('switchChat', this.chat._id, this.read)
      }
      this.switching = true
    },

    showSettings() {
      this.settings = true
    },

    hideSettings() {
      this.settings = false
      this.switching = false
    },

    chatText(lastMsg) {
      return lastMsg.txt ? lastMsg.txt :
        lastMsg.img ? 'Photo' : ''
    }
  },

  computed: {
    dpUrl() {
      return this.chat._id && this.dp ?
        `${config.SERVER_URL}/images/chats/${this.chat._id}/${this.dp}` :
        ''
    },
  },
}
</script>