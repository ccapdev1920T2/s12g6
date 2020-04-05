<template>
<div id="message" class="m-2 mb-2">
  <img id="userPic" v-if="imgUrl" :src="imgUrl" alt="" 
    class="rounded-full w-10 h-10 m-2 mr-4">
  <div v-if="message.txt" id="msgText" class="message text-lg rounded-lg px-5 py-2"
      :class="messageType">
      {{ message.txt }}
  </div>
  <div v-else-if="message.img" class="message text-lg p-1"
      :class="messageType">
      <img :src="getImg()" class="w-128"/>
  </div>
</div>
</template>

<style src="@/App.css"></style>
<style scoped>
.message {
  word-break: break-all;
  position: relative;
  width: max-content;
  max-width: 60%;
  margin: 8px 0;
} 

.message-user-self {
  margin-left: auto;
  color: #FFFFFF;
  background-color: #E83A63;
}

.message-user-match {
  color: #424242;
  background-color: #EDEDED;
}

#message {
  display: flex;
}

#userPic {
  object-fit: cover;
}
</style>

<script>
import config from '../../config'

export default {
  props: {
    imgUrl: String,
    message: Object,
    user: String,
    chatID: String
  },
  
  computed: {
    messageType() {
      let classes = {}
      classes[`message-user-${this.user}`] = true
      return classes
    }
  },

  methods: {
    getImg() {
      return this.message.img ? 
        `${config.SERVER_URL}/images/chats/${this.chatID}/${this.message.img}` :
        ''
    },
  },
}
</script>

