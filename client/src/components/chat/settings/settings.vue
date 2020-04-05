<template>
<div class="modal-backdrop"> 
  <div class="settings-modal modal bg-white relative">
    <!-- Sidebar/Dropdown -->
    <transition name="fade">
      <div id="sidebar" class="overflow-scroll shadow-lg md:shadow-none" 
        :class="{ hidden: !showingMenu, block: showingMenu  }">
        <h1 class="font-bold text-dark-grey text-2xl" id="title">
          Edit your profile
        </h1>
        <ul class="text-xl" id="options">
          <li 
            class="my-4 inactive cursor-pointer" 
            :class="getForm('u')"
            @click="select('u')">
            User Details
          </li>
          <li 
            class="my-4 inactive cursor-pointer" 
            :class="getForm('i')"
            @click="select('i')">
            Interests
          </li>
          <li 
            class="my-4 inactive cursor-pointer" 
            :class="getForm('p')"
            @click="select('p')">
            Pictures
          </li>
        </ul>
      </div>
    </transition>

    <!-- Forms -->
    <user-form v-if="currentForm === 'u'" 
      @close="$emit('close')"
      @toggleMenu="toggleMenu" />
    <pictures-form v-else-if="currentForm === 'p'" 
      @close="$emit('close')"
      @toggleMenu="toggleMenu" />
    <interests-form v-else-if="currentForm === 'i'" 
      @close="$emit('close')"
      @toggleMenu="toggleMenu" />
  </div>
</div>
</template>

<style src="@/App.css"></style>
<style src="@/assets/stylesheets/modal.css"></style>
<style src="@/assets/stylesheets/component-styles/settings.css"></style>
<style scoped>
#title {
  padding-left: 8px;
}

li {
  padding: 8px 8px 8px 12px;
  min-width: 143px;
}

.selected {
  background: linear-gradient(to right, #E83A63, #FF819E);  
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  color: #FFF;
  min-width: 143px;
}
</style>

<script>
import UserForm from '@/components/chat/settings/user-form.vue'
import PicturesForm from '@/components/chat/settings/pictures-form.vue'
import InterestsForm from '@/components/chat/settings/interests-form.vue'

export default {
  data() {
    return {
      currentForm: 'u',
      showingMenu: false
    }
  },

  name: 'Modal',

  components: {
    UserForm, 
    PicturesForm, 
    InterestsForm
  },

  methods: {
    select(form) {
      this.currentForm = form;
      this.showingMenu = false;
    },

    getForm(form) {
      return { 
        selected: this.currentForm === form,  
        inactive: this.currentForm !== form,  
      }
    },

    toggleMenu() {
      this.showingMenu = !this.showingMenu;
    }
  },
}
</script>