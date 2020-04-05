<template>
<div class="h-screen w-screen flex" id="chatPage">
  <loading v-if="loading" :bg="bg"/>
  <dialog-item
    :show.sync="showDialog"
    :header="dialog.header"
    :msg="dialog.msg"/>
  <div>
    <!-- Background -->
    <div class="bg-light-main h-screen w-screen absolute"></div>

    <!-- Settings -->
    <transition name="modal-fade">
      <settings class="bg-light-main z-20" @close="closeSettings" v-if="isSettingsVisible" />
    </transition>

    <!-- Reports -->
    <transition name="modal-fade">
      <report class="bg-light-main absolute z-20" v-if="isReportVisible" @close="closeReports" />
    </transition>

    <!-- Main Chat Page -->
    <div class="absolute z-10 h-screen w-screen flex">
      <sidebar-chat class="w-full md:w-1/4 md:block shadow-lg" :class="{ hidden: isChatVisible }"
        @viewChat="toggleChatView" 
        @viewMatch="toggleChatView" 
        @settingsClicked="openSettings"
        @openReport="openReportPage"/>

      <chat-main class="w-full md:w-3/4" :class="{ block: isChatVisible, hidden: !isChatVisible }"
        @viewAllChats="viewAllChats" 
        @openSettings="openSettings"
        @openReport="openReportPage" />
    </div>
  </div>
</div>
</template>

<style src="@/assets/stylesheets/util/transitions.css"></style>

<script>
import SidebarChat from '@/components/chat/sidebar-chat.vue'
import ChatMain from '@/components/chat/chat-main.vue'
import Settings from '@/components/chat/settings/settings.vue'
import Report from '@/components/report.vue'
import Loading from '@/components/loading.vue'
import DialogItem from '@/components/dialog-item.vue'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      isChatVisible: false,
      isSettingsVisible: false,
      isReportVisible: false,
      matching: false,
      showDialog: false,
    }
  },
  
  components: {
    SidebarChat,
    ChatMain,
    Settings,
    Report,
    Loading,
    DialogItem
  },

  computed: {
    ...mapGetters({
      currentMatch: 'getMatchProfile',
      loading: 'isLoading',
      bg: 'isBG',
      dialog: 'getDialog'
    })
  },

  methods: {
    openSettings() {
      this.isSettingsVisible = true;
    },
    
    closeSettings() {
      this.isSettingsVisible = false;
    },
    
    toggleChatView() {
      this.isChatVisible = true;
    },

    viewAllChats() {
      console.log('visible')
      this.isChatVisible = false;
    },
    
    openReportPage() {
      this.isReportVisible = true;
    },

    closeReports() {
      this.isReportVisible = false;
    },

    isObjectEmpty(obj) {
      for (let key in obj)
        return true
      return false
    }
  },

  created() {
    // load all the things needed
    this.$store.dispatch('initChat')
      .then(() => {
        this.$store.dispatch('setLoading', false)
        this.$store.dispatch('getMatches')
      })
      .catch(err => {
        console.log(err) // 403 error
      }) // TODO: Alert UI
  },

  watch: {
    dialog(dialog) {
      if (this.isObjectEmpty(dialog))
        this.showDialog = true
    }
  }
}
</script>