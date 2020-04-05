<template>
<div class="h-screen w-screen flex">
  <sidebar-admin class="w-full lg:w-1/6 sm:block" 
                :class="{ block: isAdminVisible, hidden: !isAdminVisible }" 
                @switchPage="switchPage" />
  <user-admin class="w-full h-full lg:w-5/6"
              :class="{ hidden: isAdminVisible, block: !isAdminVisible }"
              @showNav="isAdminVisible = true"
              :tab="currentTab" />
</div>
</template>

<style src="@/App.css"></style>

<script>
import SidebarAdmin from '@/components/admin/sidebar-admin.vue';
import UserAdmin from '@/components/admin/user-admin.vue';

import AdminService from '@/services/AdminService';

export default {
  data() {
    return {
      isAdminVisible: false,
      currentTab: 'Users'
    }
  },

  components: {
    UserAdmin,
    SidebarAdmin
  },

  methods: {
    switchPage(page) {
      if (page === 'Logout') {
        AdminService.logout()
          .then(() => {
            this.$router.push('/');
          }).catch(err => {
            console.log(err);
          })
        return;
      }
      
      this.currentTab = page;
      this.isAdminVisible = false;
    },
  }
}
</script>
