<template>
<div class="h-screen bg-white flex flex-col p-0 m-0 overflow-y-scroll" id="sidebarChat">
  <!-- User -->
  <div class="flex items-center p-3 user relative">
    <img class="rounded-full h-12 w-12 object-cover cursor-pointer"
      @mouseover="showingMenu = true"
      @mouseleave="showingMenu = false"
      :src="dpUrl"  />

    <span class="ml-3 text-lg">{{ user.userInfo.fname }} {{ user.userInfo.lname }}</span>
  </div>

  <!-- User Menu -->
  <div id="userMenu" class="overflow-scroll shadow-lg ml-2 p-2" 
    :class="{ hidden: !showingMenu, block: showingMenu  }"
    @mouseover="showingMenu = true"
    @mouseleave="showingMenu = false">

    <ul class="text-md" id="options">
      <li class="m-2 inactive cursor-pointer" @click="openMyProfile">
        <font-awesome-icon icon="user" class="mr-1" />
        My Profile
      </li>
      <li class="m-2 inactive cursor-pointer" @click="$emit('settingsClicked')">
        <font-awesome-icon icon="cog" class="mr-1" />
        Settings
      </li>
      <router-link to="/">
        <li class="m-2 inactive cursor-pointer" @click="loggingOut"> 
          <font-awesome-icon icon="sign-out-alt" class="mr-1" />
          Log Out
        </li>
      </router-link>
    </ul>
  </div>

  <!-- Search -->
  <div id="search" class="relative">
    <input 
      type="text"
      v-model="filter" 
      class="w-full p-2 outline-none rounded-none bg-light-pink" 
      style="background-color: #FFEBF0;"
      placeholder="Search Messages"  />
    <font-awesome-icon
      icon="search" 
      class="absolute z-10 text-muted" id="icon" />
  </div>

  <!-- Find Matches -->
  <div class="flex flex-col find-match mt-3">
    <!-- Button removed -->
    <!-- <button class="self-center rounded-full shadow-lg my-2 py-4 px-12 find-match-link"
            @click="findMatches"
            v-if="!shouldShowMatch">
      <i class="font-bold text-xl">match me!</i>
    </button>  -->
    <div class="flex-col overflow-x-scroll">
      <span class="flex  px-3 font-black text-hot-pink">new matches</span>
      <div v-if="matches.length === 0" class="mt-10 text-gray-700 text-2xl">
        No Matches Found :(
      </div>
      <div v-else id="matches" class="flex flex-row flex-no-wrap mx-2">
        <match-icon
          v-for="match in matches"
          :key="match._id"
          :id="match._id"
          :name="match.userInfo.nickname"
          :dp="match.dp"
          @viewMatch="openMatch(match._id)" />
      </div>
    </div>
  </div>

  <!-- Messages or Empty Notification-->
  <div v-if="isChatsEmpty" class="py-5 text-gray-700 text-3xl" id="nochat">
    <center><img src="@/assets/images/nochat.svg" /></center>
  </div>
  <div v-else>
    <ul>
      <span class="flex px-3 font-black text-hot-pink">messages</span>
      <chat-item
        v-for="chat in currentChats" :key="chat._id"
        :chat="chat"
        :read="getID(chat, chat.lastUser) === user._id ? true : chat.read"
        @report="reportUser({ _id: getID(chat, chat.match), name: chat[chat.match] })"
        :dp="chat[`${chat.match}img`]"
        @switchChat="viewChat"
        @deleteChatAndUnmatch="deleteChatAndUnmatch(chat._id)"/>
    </ul>
  </div>
</div>
</template>

<style src="@/App.css"></style>
<style scoped>
.user {
    background: linear-gradient(to right, #E83A63, #FF819E);
    color: #FFFFFF;
}

.find-match {
    text-align: center;
    padding: 8px 0;
}

.find-match-link {
    background-color: #E83A63;
    color: #FFFFFF;
    font-size: 1.125em;
}

input {
  border: none;
  background-color: #F2F8FF;
}

#icon {
  right: 12px;
  top: 12px;
}

#userMenu {
  position: absolute;
  top: 60px;
  height: auto;
  width: max-content;
  padding: 6px;
  z-index: 10;
  background-color: #FFFFFF;
  border: 1px solid #EDEDED;
  border-radius: 6px;
}

#options li:hover {
  color: #E83A63;
}
</style>

<script>
import config from '@/config';
// MODULES
import { mapGetters } from 'vuex';
// COMPONENTS
import ChatItem from '@/components/chat/chat-item';
import MatchIcon from '@/components/chat/match-icon';
//
import { ChatSearch } from '../../classes/CancelPromise';

export default {
  data() {
    return {
      showingMenu: false,
      settings: false,
      filteredChats: [],
      filter: '',
      filterPromises: [],
    }
  },

  name: 'sidebarChat',

  components: { 
    ChatItem, 
    MatchIcon
  },

  computed: {
    ...mapGetters({
      chat: 'getCurrentChat',
      chats: 'getAllChats', 
      currentChat: 'getCurrentChat',
      matches: 'getAllMatches',
      user: 'getCurrentUser'
    }),
  
    dpUrl() {
      return this.user._id && this.user.dp ?
        `${config.SERVER_URL}/images/users/${this.user._id}/${this.user.dp}` :
        ''
    },

    words() {
      return this.getWords(this.filter)
    },

    isChatsEmpty() {
      return this.chats.length === 0
    },

    // shouldShowMatch() { // No chat and not matching
    //   // this.findMatches()
    //   let show = (this.isChatsEmpty || this.chat === -1) || this.matching
    //   if (!show) {
    //     this.$store.dispatch('switchChat', this.chats[0]._id)
    //   }
    //   return show
    // },

    currentChats() {
      return this.filter.trim() === '' ? this.chats : this.filteredChats
    }
  },

  methods: {
    viewChat(chatID, read) {
      this.filter = ''
      this.$store.dispatch('switchChat', chatID)
      if (read === false) // update db to true
        this.$store.dispatch('updateReadChat', { chatID })
      this.$emit('viewChat')
    },

    openMatch(matchID) {
      this.$store.dispatch('viewMatch', matchID)
      this.$emit('viewMatch')
    },

    openMyProfile() {
      this.$store.dispatch('viewMyProfile')
      this.$emit('viewMatch')
    },

    getID(chat, uOne) {
      return uOne === 'u1' && chat._id ? chat._id.substring(0, 24) : chat._id.substring(25)
    },

    loggingOut() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.replace('/')
        }).catch(err => {
          console.log(err)
        })
    },

    reportUser(reported) {
      this.$store.dispatch('reportUser', reported)
      this.$emit('openReport')
    },

    deleteChatAndUnmatch(chatID) {
      // TODO: dialog box yes or no
      this.$store.dispatch('deleteChatAndUnmatch', chatID)
    },
  },
  
  watch: {
    filter(filter) { // filter chat/messages
      // if chat is 0 then do not filter chats
      if (this.chats.length === 0)
        return

      // set filteredChat to empty
      this.filteredChats = [];
      while (this.filterPromises.length > 0) {
        // check if the promise is not done yet
        if (this.filterPromises[0].running())
          this.filterPromises[0].cancel()
        this.filterPromises.shift()
      }

      // sanitize filter
      const prev = filter;
      filter = filter.trim().toLowerCase()
      // if filter is empty
      if (filter === '')
        return

      let cp;
      for (let i = 0; i < this.chats.length && this.filter === prev; i++) {
        cp = new ChatSearch(this.chats[i], filter)
        cp.promise
          .then(searchChat => this.filteredChats.push(searchChat))
          .catch(() => {})
        this.filterPromises.push(cp)
      }
    },
  },
}
</script>
