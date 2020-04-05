<template>
<div id="sidebarAdmin" class="h-screen overflow-scroll shadow-lg flex flex-col p-0 m-0 relative">
  <!-- User -->
  <div class="w-full flex items-center p-3 user">
    <img class="rounded-full h-12 w-12 object-cover"
        src="@/assets/images/profile/boy.jpg">
    <span class="ml-3 text-lg font-bold">welcome, {{ admin }}</span>
  </div>

  <!-- Nav -->   
  <div class="bg-white flex items-center">
    <ul class="m-5">
      <li class="list-item text-lg text-dark-grey mr-3 my-3 cursor-pointer"
        :class="getTab('Users')"
        @click="switchPage('Users')">
        Users
      </li>
      <li class="list-item text-lg text-dark-grey mr-3 my-3 cursor-pointer"
        :class="getTab('Reports')"
        @click="switchPage('Reports')">
        Reports
      </li>
      <li class="list-item text-lg text-dark-grey mr-3 my-3 cursor-pointer"
        :class="getTab('Chats')"
        @click="switchPage('Chats')">
        Chats
      </li>
      <li class="list-item text-lg text-dark-grey mr-3 my-3 cursor-pointer"
        :class="getTab('Logout')"
        @click="switchPage('Logout')">
        Log out
      </li>
    </ul>
  </div>
</div>
</template>

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

#searchIcon {
  right: 12px;
  top: 12px;
}

@media(min-width: 1024px) {
  #hamburger {
    display: none
  }
}

.list-item {
  padding: 8px 8px 8px 12px;
  margin: 12px;
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
import AdminService from '@/services/AdminService';

export default {
  data() {
    return {
      admin: '',
      tabs: ['Users', 'Reports', 'Chats', 'Log out'] ,
      currentTab: 'Users'
    }
  },

  methods: {
    switchPage(tab) {
      this.currentTab = tab;
      this.$emit('switchPage', tab);
    },

    getTab(tab) {
      return { 
        selected: this.currentTab === tab,  
        inactive: this.currentTab !== tab,  
      }
    }
  },

  created() {
    AdminService.getAdmin()
      .then(({ data }) => this.admin = data)
      .catch(err => {
        console.log(err);
        this.$router.push('/admin/login');
      });
  }
}
</script>

