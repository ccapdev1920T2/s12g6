<template>
<div id="chat" class="h-screen relative md:block overflow-y-scroll">
  <!-- Header -->
  <div class="w-full flex p-3 bg-light-main" id="headerBG" v-if="shouldShowChat">
    <font-awesome-icon 
      class="mr-3 text-2xl my-auto text-hot-pink lg:hidden"
      @click="back" 
      icon="angle-left" />

    <div class="w-max-content flex items-center p-1 pr-12 bg-white rounded-full shadow-md cursor-pointer"
      @click="viewProfile">
      <img class="rounded-full h-12 w-12 p-1 object-cover" :src="imgMatchUrl">
      <span class="ml-3 text-lg font-bold" v-if="chat">
        {{ chat[chat.match] }}
      </span>
    </div>
  </div>

  <!-- Body -->
  <div 
    class="w-full overflow-y-scroll" 
    id="chatBody" 
    v-if="shouldShowChat"
    style="height: calc(100vh - 9em)">
    <div class="w-full flex-col items-end">
      <message-item
        v-for="message in chat.messages"
        :key="`${message.user}_${message.time}`"
        :imgUrl="chat.self !== message.user ? imgMatchUrl : undefined"
        :message="message"
        :chatID="chat._id"
        :user="chat.self === message.user ? 'self' : 'match'" />
    </div>
  </div>

  <div class="w-full h-full flex justify-center items-center overflow-y-scroll" 
    v-if="shouldShowMatch">
    <profile 
      class="h-65 w-75"
      :id="currentMatch._id"
      :userInfo="currentMatch.userInfo"
      :images="currentMatch.images"
      :dp="currentMatch.dp"
      :showLikesDislikes="showLikesDislikes"
      @initChat="initChat"
      @unmatchMatch="unmatchMatch"
      @hideMatch="hideMatch" 
      @openSettings="$emit('openSettings')"
      @openReport="openReport({ _id: currentMatch._id, name: `${currentMatch.userInfo.fname} ${currentMatch.userInfo.lname}` })" />
  </div>

  <!-- Textbox -->
  <div class="w-full h-12 my-2 bottom-0 px-4" v-if="shouldShowChat">
    <div class="relative flex">
      <font-awesome-icon
        class="text-2xl cursor-pointer text-link mx-3 flex self-center"
        icon="calendar-alt"
        size="2x"/>

      <font-awesome-icon
        id="image"
        class="text-2xl cursor-pointer text-link mx-3 mr-6 flex self-center"
        icon="image"
        @click="chooseImage" />

      <input type="file" accept="image/*" @change="sendImage" ref="image" hidden>
      <textarea 
        class="w-full h-12 p-2 px-4 text-lg leading-relaxed resize-none overflow-hidden outline-none rounded-full"
        id="chatBox"
        placeholder="Type your message..."
        @keyup.enter="sendOwnMessage"
        v-model="text"
        name="chatInput"></textarea>
      <font-awesome-icon 
        @click="sendOwnMessage"
        icon="location-arrow"
        class="absolute z-10 text-lg cursor-pointer text-link icon-top-25" />
    </div>  
  </div>
</div>
</template>

<style src="@/App.css"></style>
<style scoped>
#searchIcon {
  right: 12px;
  top: 12px;
}

#chatBox {
  border: 1px solid #E0E0E0;
  background-color: #F6F6F6;
}
</style>

<script>
import config from '@/config'
// MODULES
import { mapGetters } from 'vuex'
import * as io from 'socket.io-client'
// COMPONENTS
import MessageItem from '@/components/chat/message-item.vue'
import Profile from '@/components/profile.vue'
// SERVICES
import ChatService from '@/services/ChatService'

export default {
  components: {
    MessageItem,
    Profile,
  },

  data() {
    return {
      socket: io(config.SERVER_URL),
      text: '',
      isOwnSend: false,
      date: null,
      setDate: false,
      showLikesDislikes: true,
    }
  },

  computed: {
    ...mapGetters({
      user: 'getCurrentUser',

      // Chat
      chats: 'getAllChats',
      chat: 'getCurrentChat',
      
      // Match
      matches: 'getAllMatches',
      currentMatch: 'getMatchProfile'
    }),

    getSender() {
      return this.isOwnSend ? 'self' : 'match'
    },

    imgMatchUrl() {
      return this.chat.match === 'new' ?
        `${config.SERVER_URL}/images/users/${this.chat._id}/${this.chat.emptyImg}` : (
          this.chat[this.chat.match + 'img'] ? 
          `${config.SERVER_URL}/images/chats/${this.chat._id}/${this.chat[this.chat.match + 'img']}` : 
          ''
        )
    },

    isChatEmpty() {
      return this.chats.length === 0
    },

    shouldShowChat() {
      return this.isNotEmpty(this.chat)
    },

    shouldShowMatch() {
      return this.currentMatch && !this.isNotEmpty(this.chat)
    },
  },

  methods: {
    // let the user make a message first before making the chat
    initChat() {
      this.newChat = true
      this.$store.dispatch('newEmptyChat')
        .then(() => {
          this.$emit('viewAllChats')
        }).catch(err => {
          console.log(err)
          this.$store.dispatch('setDialog', {
            header: 'Chat not created',
            msg: 'Something went wrong'
          })
        })
    },

    sendOwnMessage() { // send this message to the backend
      if (this.chat.match === 'new') {
        this.newChat = false
        this.$store.dispatch('createChat', { match: this.currentMatch, txt: this.text })
          .then(data => {
            // console.log(data)
            this.socket.emit('save-chat', data) // chat, matchID
          })
        this.text = ''
      } else {
        ChatService.postMessage(this.chat._id, this.text)
          .then(res => {
            const message = res.data
            // unread messages
            if (message !== '')
              this.socket.emit('save-message', message)

            this.text = ''
            this.scrollToBottom()
          }).catch(err => {
            console.log(err)
            this.$store.dispatch('setDialog', {
              header: 'Message not sent',
              msg: 'Something went wrong'
            })
          })
      }
    },

    back() {
      this.$emit('viewAllChats')
    },

    scrollToBottom() {
      let chatBody = this.$el.querySelector("#chatBody")
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight
      } 
    },

    // changed
    unmatchMatch() {
      this.$store.dispatch('unmatchMatch', this.currentMatch)
        .then(({ match }) => {
          console(match)
          // this.$store.dispatch('setDialog', {
          //   header: 'Unmatched Successful',
          //   msg: `Unmatched ${match.userInfo.fname} ${match.userInfo.lname}`
          // })
        })
        .catch(err => {
          console.log(err)
          this.$store.dispatch('setDialog', {
            header: 'Unmatched unsuccessful',
            msg: `Did not unmatch with current match`
          })
        })
    },

    hideMatch() {
      this.$store.dispatch('hideMatch')
    },

    openReport(reportedUser) {
      this.$emit('openReport')
      this.$store.dispatch('reportUser', reportedUser)
    },

    chooseImage() {
      this.$refs.image.click()
    },

    sendImage() {
      let formData = new FormData()
      const file = this.$refs.image.files[0]
      if (file) {
        formData.append('image', file)
        this.$refs.image.files = []
        ChatService.postImage(this.chat._id, formData)
          .then(res => {
            const message = res.data
            // unread messages
            if (message !== '')
              this.socket.emit('save-message', message)

            this.scrollToBottom()
          }).catch(err => {
            console.log(err)
            this.$store.dispatch('setDialog', {
              header: 'Image not sent',
              msg: `Something went wrong`
            })
          })
      }
    },

    viewProfile() {
      console.log('view')
      // get chat match
      if (this.chat.match === 'u1') {
        this.$store.dispatch('getUserById', this.chat._id.substring(0, 24))
      } else {
        this.$store.dispatch('getUserById', this.chat._id.substring(25))
      }
    },

    isNotEmpty(obj) {
      for (let key in obj)
        return true
      return false
    },
  },
  
  created() {
    this.newChat = false

    this.socket.on('new-message', function(data) {
      // data => chatID and msg
      this.$store.dispatch('chatPushToTop', data)
    }.bind(this))

    this.socket.on('new-chat', function(data) {
      const { newChat, matchID, userID } = data
      if (matchID === this.user._id)
        this.$store.dispatch('newChatPushToTop', { newChat, userID })
    }.bind(this))
  },

  updated() {
    this.scrollToBottom()
  },

  watch: {
    date(date) {
      if (!date) return

      console.log(date)
      this.setDate = false
    }
  }
}
</script>