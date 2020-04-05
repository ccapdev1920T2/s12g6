<template>
<div id="mainAdmin" class="h-screen bg-light-main p-5">
  <report-review 
    v-if="showReport"
    :report="report"
    :date="date(report.date)"
    @warnUser="warnUser(report._id, report.reported)"
    @deleteUser="deleteUser(report._id, report.reported)"
    @dismissReport="dismissReport(report._id)"/>
  <div class="flex items-center">
    <font-awesome-icon class="text-muted sm:block lg:hidden" id="hamburger"
                  icon="bars" @click="$emit('showNav')" />
    <h1 class="text-2xl font-black text-dark-grey mx-5
                lg:mx-0
                md:text-3xl" id="title">
      <i class="text-hot-pink">anispark headquarters</i>
    </h1>
  </div>

  <!-- Tables -->
  <div class="flex flex-col mt-8">
    <!-- Title -->
    <div class="flex" id="users">
      <h1 class="text-2xl font-black text-dark-grey mr-3 w-1/6
                  md:text-3xl
                  lg:w-20" 
                  v-if="tab === 'Users'">Users</h1>
      <h1 class="text-2xl font-black text-dark-grey mr-3 w-1/6
                  md:text-3xl lg:w-20"
                  v-else-if="tab === 'Reports'">Reports</h1>
      <h1 class="text-2xl font-black text-dark-grey mr-3 w-1/6
                  md:text-3xl lg:w-20"
                  v-else-if="tab === 'Chats'">Chats</h1>

      <div class="relative mx-10 w-5/6 lg:w-64">
        <input type="text" class="w-full p-2 rounded-md z-0" 
                v-model="filter"
                placeholder="Search" />
        <font-awesome-icon 
          icon="search" 
          class="absolute top-0 right-0 right-10 z-10 text-muted" id="searchIcon" />
      </div>
    </div>

    <!-- Users -->
    <div class="overflow-x-auto" v-if="tab === 'Users'">
      <table class="w-full mt-5 table-auto bg-white rounded-lg overflow-x-auto">
        <thead class="bg-light-pink">
          <tr class="text-white">
            <th class="px-4 py-2">id</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
            <!-- <th class="px-4 py-2">Age</th>
            <th class="px-4 py-2">Likes</th>
            <th class="px-4 py-2">Dislikes</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in allUsers" :key="user._id">
            <td class="border-none px-4 py-2 text-center">{{ user._id }}</td>
            <td class="border-none px-4 py-2 text-center">{{ user.userInfo.fname }} {{ user.userInfo.lname }}</td>
            <td class="border-none px-4 py-2 text-center">{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Reports -->
    <div class="w-full overflow-x-auto" v-else-if="tab === 'Reports'">
      <button class="text-hot-pink" @click="sortDate">Sort By Date</button>
      <table class="mt-5 table-auto bg-white rounded-lg">
        <thead class="bg-light-pink">
          <tr class="text-white">
            <th class="px-4 py-2">REVIEW</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Report Id</th>
            <th class="px-4 py-2">User Id</th>
            <th class="px-4 py-2">Reported Id</th>
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in allReports" :key="report._id">
            <td class="border-none px-4 py-2 text-center">
              <button v-if="report.status === 'pending'" @click="reviewReport(report._id)">
                Review
              </button>
            </td>
            <td class="border-none px-4 py-2 text-center">{{ report.status }}</td>
            <td class="border-none px-4 py-2 text-center">{{ report._id }}</td>
            <td class="border-none px-4 py-2 text-center">{{ report.user }}</td>
            <td class="border-none px-4 py-2 text-center">{{ report.reported }}</td>
            <td class="border-none px-4 py-2 text-center">{{ report.reportType }}</td>
            <td class="border-none px-4 py-2 text-center">{{ date(report.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>  

    <!-- Chats -->
    <div class="w-full overflow-x-auto" v-else-if="tab === 'Chats'">
      <table class="mt-5 table-auto bg-white rounded-lg">
        <thead class="bg-light-pink">
          <tr class="text-white">
            <th class="px-4 py-2">id</th>
            <th class="px-4 py-2">User 1</th>
            <th class="px-4 py-2">User 2</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="chat in allChats" :key="chat._id">
            <td class="border-none px-4 py-2 text-center">{{ chat._id }}</td>
            <td class="border-none px-4 py-2 text-center">{{ chat.u1 }}</td>
            <td class="border-none px-4 py-2 text-center">{{ chat.u2 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>  
</template>

<style scoped>
#searchIcon {
  right: 12px;
  top: 12px;
}
</style>

<script>
import UserService from '@/services/UserService'
import ChatService from '@/services/ChatService'
import ReportService from '@/services/ReportService'

import ReportReview from '@/components/admin/report-review.vue'

import { AdminUserSearch, AdminChatSearch, AdminReportSearch } from '@/classes/CancelPromise'
const moment = require('moment')

export default {
  data() {
    return {
      users: [],
      chats: [],
      reports: [],
      filter: '',
      filtered: [],
      promises: [],
      report: {},
      showReport: false,
    }
  },

  components: {
    ReportReview
  },
  
  props: [ 'tab' ],

  computed: {
    allUsers() {
      return this.filter.trim() === '' ? this.users : this.filtered;
    },

    allChats() {
      return this.filter.trim() === '' ? this.chats : this.filtered;
    },

    allReports() {
      return this.filter.trim() === '' ? this.reports : this.filtered;
    },
  },

  methods: {
    userFilter(filter) {
      console.log(this.users);
      const prev = filter;
      let cp;
      for (let i = 0; i < this.users.length && this.filter === prev; i++) {
        cp = new AdminUserSearch(this.users[i], filter);
        cp.promise
          .then(searched => this.filtered.push(searched))
          .catch(() => {});
        this.promises.push(cp);
      }
    },

    chatFilter(filter) {
      const prev = filter;
      let cp;
      for (let i = 0; i < this.chats.length && this.filter === prev; i++) {
        cp = new AdminChatSearch(this.chats[i], filter);
        cp.promise
          .then(searched => this.filtered.push(searched))
          .catch(() => {});
        this.promises.push(cp);
      }
    },

    reportFilter(filter) {
      const prev = filter;
      let cp;
      for (let i = 0; i < this.reports.length && this.filter === prev; i++) {
        cp = new AdminReportSearch(this.reports[i], filter);
        cp.promise
          .then(searched => this.filtered.push(searched))
          .catch(() => {});
        this.promises.push(cp);
      }
    },

    sortDate() {
      this.reports.sort((r1, r2) => r1.date > r2.date ? 1 : r1.date < r2.date ? -1 : 0)
    },

    date(date) {
      return moment(date).format('MMM Do YYYY');
    },

    reviewReport(reportID) {
      this.report = this.reports.find(r => r._id === reportID)
      console.log(this.report)
      this.showReport = true
    },

    warnUser(id, reported) {
      UserService.warnUser(reported)
        .then(() => {
          return ReportService.dismissReport(id)
        }).then(() => {
          let i = this.reports.findIndex(r => r._id === id)
          this.reports[i].status = 'complete'
          this.showReport = false
        })
    },

    deleteUser(id, reported) {
      UserService.deleteUserByAdmin(reported)
        .then(() => {
          let i = this.users.findIndex(u => u._id === id)
          this.users.splice(i, 1)
          return ReportService.dismissReport(id)
        }).then(() => {
          let i = this.reports.findIndex(r => r._id === id)
          this.reports[i].status = 'complete'
          this.showReport = false
        })
    },

    dismissReport(reportID) {
      ReportService.dismissReport(reportID)
        .then(({ data }) => {
          let i = this.reports.findIndex(r => r._id === data)
          this.reports[i].status = 'complete'
          this.showReport = false
        })
    },
  },

  created() {
    UserService.getAllUsers()
      .then(({ data }) => this.users = data)
      .catch(err => console.log(err)); // TODO: Alert UI
    
    ReportService.getAllReports()
      .then(({ data }) => this.reports = data)
      .catch(err => console.log(err)); // TODO: Alert UI
    
    ChatService.getAllChats()
      .then(({ data }) => this.chats = data)
      .catch(err => console.log(err)); // TODO: Alert UI
  },

  watch: {
    filter: function(filter) {
      this.filtered = [];
      while (this.promises.length > 0) {
        // check if the promise is not done yet
        if (this.promises[0].running())
          this.promises[0].cancel();
        this.promises.shift();
      }

      // sanitize filter
      filter = filter.trim().toLowerCase();
      if (filter === '') {
        return;
      }

      switch(this.tab) {
        case 'users':
          this.userFilter(filter);
        break;
        case 'chats':
          this.chatFilter(filter);
        break;
        default: // 'reports'
          this.reportFilter(filter);
        break;
      }
    },

    tab() {
      this.filtered = [];
      while (this.promises.length > 0) {
        // check if the promise is not done yet
        if (this.promises[0].running())
          this.promises[0].cancel();
        this.promises.shift();
      }

      this.filter = '';
    }
  }
}
</script>