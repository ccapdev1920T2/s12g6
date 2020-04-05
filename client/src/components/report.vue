<template>
<transition name="modal-fade">
<div class="modal-backdrop"> 
  <!-- Choice Modal -->
  <div class="modal bg-white report-container choice-modal" v-if="choosingReports">

    <font-awesome-icon 
      class="absolute icon-top-right mr-2 text-2xl my-auto text-hot-pink cursor-pointer"
      @click="close" 
      icon="times" />

    <div id="title" class="m-5 mb-0 h-12">
      <h1 class="font-black text-2xl text-dark-grey">
        Report a User
      </h1>
    </div>
    <!-- Options -->
    <div id="optionsContainer" class="flex flex-col">
      <div id="option" class="shadow-lg grow m-5 cursor-pointer" v-for="type in types" :key="type.id">
        <img id="optionImg" :src="require(`@/assets/images/report/${type.img}`)" 
          class="rounded-lg cursor-pointer" 
          @click="setReport(type.name)" />
        <h1 id="type" class="font-bold mt-3 text-lg text-white">
          {{ type.name }}
        </h1>
      </div>
    </div>
  </div>

  <!-- Report Form -->
  <div class="modal bg-white report-container report-modal" v-if="!choosingReports">
      <div id="title" class="m-5 h-10">
      <font-awesome-icon class="text-hot-pink cursor-pointer" id="back" icon="angle-left" 
        @click="toggleReportForm" />
      <h1 class="font-black m-5 text-2xl text-dark-grey">
        Report a User
      </h1>
    </div>

    <font-awesome-icon 
      class="absolute icon-top-right mr-2 text-2xl my-auto text-hot-pink cursor-pointer"
      @click="close" 
      icon="times" /> 

    <div id="reportForm" class="mx-5 mt-0">
      <div class="normal-form">
        <label for="targetUser" class="mb-2">
          Who would you like to report? *
        </label>
        <input type="text" class="px-2" name="targetUser" :value="reportedUser.name"
          placeholder="Enter a user's name" required readonly>
      </div>
      <div class="normal-form">
        <label for="title" class="mb-2">
          Please enter a short title for your report. *
        </label>
        <input type="text" class="px-2" name="title" v-model="title"
          placeholder="Enter a maximum of ten words" required>
      </div>
      <div class="mb-4 flex flex-col">
        <label for="incident" class="mb-2">
          Briefly describe the incident *
        </label>
        <textarea name="incident" id="incident" v-model="description"
          placeholder="Kindly limit your description to 250 words."
          class="resize-none p-2" cols="30" rows="6">
        </textarea>
      </div>

      <div id="buttonWrapper">
        <button 
          class="btn btn-primary btn-rounded my-5"
          :class="classButton"
          @click="submitReport"
          :disabled="!validate">
            Report
        </button> 
      </div>
    </div>
  </div>
</div>
</transition>
</template>

<style src="@/App.css"></style>
<style src="@/assets/stylesheets/component-styles/report/report.css"></style>
<style src="@/assets/stylesheets/component-styles/user-form.css"></style>
<style src="@/assets/stylesheets/modal.css"></style>
<style scoped>
.grow:hover {
  transform: scale(1.02);
}
</style>

<script>
import { mapGetters } from 'vuex'

import ReportService from '../services/ReportService'

export default {
  data() {
    return {
      types: [
        { id: 0, name: 'abusive chat', img: 'chat.jpg' }, 
        { id: 1, name: 'underaged user', img: 'underage.png' }, 
        { id: 2, name: 'sexual', img: 'sexual.jpg' },
        { id: 3, name: 'spam', img: 'sales.jpg' }, 
        { id: 4, name: 'other', img: 'other.jpg' }
      ],
      choosingReports: true,
      title: '',
      description: '',
      type: ''
    }
  },

  computed: {
    ...mapGetters({
      reportedUser: 'getReportedUser'
    }),

    validate() {
      return !(
        this.title === '' ||
        this.description === ''
      )
    },

    classButton() {
      return {
        highlight: this.validate,
        unhighlight: !this.validate
      }
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    setReport(type) {
      this.type = type
      this.choosingReports = false
    },

    toggleReportForm() {
      this.type = ''
      this.choosingReports = true
    },

    submitReport() {
      if (this.validate && this.reportedUser) {
        this.$store.dispatch('setLoading', true)

        let report = {
          reported: this.reportedUser._id,
          reportType: this.type,
          title: this.title,
          description: this.description
        }

        ReportService.sendReport(report)
          .then(() => {
            this.$emit('close')
            this.$store.dispatch('setDialog', {
              header: 'Report sent',
              msg: 'Report was sent and will be reviewed by an admin'
            })
          })
          .catch(err => {
            console.log(err)
            this.$store.dispatch('setDialog', {
              header: 'Report was not sent',
              msg: 'Something went wrong'
            })
          })
          .finally(() => {
            this.$store.dispatch('setLoading', false)
          })
      }
    }
  },
}
</script>