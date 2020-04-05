<template>
<div class="form-container">
  <!-- Nav -->
  <nav class="nav-top">
    <font-awesome-icon 
      id="bars"
      class="text-xl text-hot-pink cursor-pointer lg:hidden"
      @click="$emit('toggleMenu')" 
      icon="bars" />
    <font-awesome-icon 
      id="close"
      class="text-2xl my-auto text-hot-pink cursor-pointer sm:mr-6 lg:mr-0"
      @click="$emit('close')" 
      icon="times" />
  </nav>

  <form class="form-content pt-10 lg:pt-5 pb-5 m-0" @submit.prevent>
    <h1 class="font-bold self-start text-2xl text-dark-grey mb-3">
      Tweak your Interests
    </h1>

    <!-- Personality and Bio -->
    <div class="mb-4 w-full flex flex-col">
      <label for="personality" class="mb-2">
        Personality
      </label>
      <textarea 
        name="personality" id="personality" 
        class="inline-input resize-none p-2"
        v-model="personality" cols="30" rows="4">
      </textarea>
    </div>

    <!-- Likes and Dislikes -->
    <div id="likes" class="normal-form">
      <label for="likes" class="mb-2">Likes</label>
      <input-chips :chips="likes" :limit="5" />
      <!-- <input type="text" class="px-2" name="likes" v-model="likes" required> -->
    </div>
    <div id="dislikes" class="normal-form">
      <label for="dislikes" class="mb-2">Dislikes</label>
      <input-chips :chips="dislikes" :limit="5" />
      <!-- <input type="text" class="px-2" name="dislikes" v-model="dislikes" required> -->
    </div>

    <!-- Gender Preferencess -->
    <div id="genders" class="normal-form">
      <label>Gender Preferences</label>
      <div class="type-picker flex flex-row overflow-scroll">
        <input type="checkbox" name="genderpref" id="male" v-model="gpMale" />
        <label for="male">Male</label>
        <input type="checkbox" name="genderpref" id="female" v-model="gpFemale" />
        <label for="female">Female</label>
        <input type="checkbox" name="genderpref" id="gay" v-model="gpGay" />
        <label for="gay">Gay</label>
        <input type="checkbox" name="genderpref" id="lesbian" v-model="gpLesbian" />
        <label for="lesbian">Lesbian</label>
        <input type="checkbox" name="genderpref" id="bisexual" v-model="gpBi" />
        <label for="bisexual">Bisexual</label>
      </div>
    </div>
    <center>
      <button class="btn btn-primary btn-rounded my-5"
        :class="classButton"
        @click="editProfile"
        :disabled="!validate">
          Save Changes
      </button> 
    </center>
  </form>
</div>
</template>

<style src="@/assets/stylesheets/type-picker.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/settings-form.css" scoped></style>
<style src="@/assets/stylesheets/util/transitions.css" scoped></style>
<style scoped>
.grow:hover { 
  transform: scale(1.05);
}
</style>

<script>
import { mapGetters } from 'vuex';

import InputChips from '@/components/input-chips.vue';

export default {
  data() {
    return {
      userInfo: {},
      personality: '',
      likes: [],
      dislikes: [],
      gpMale: false,
      gpFemale: false,
      gpGay: false,
      gpLesbian: false,
      gpBi: false,
    }
  },

  components: {
    InputChips
  },

  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    samePref() {
      return function(field) {
        return this[field] === this.userInfo[field]
      }
    },

    sameField() {
      return function(field) {
        return this[field].trim() === '' || this[field].trim() === this.userInfo[field]
      }
    },

    notSameArray() {
      return function(field) {
        if (this[field].length === this.userInfo[field].length) {
          for (let i = 0; i < this[field].length; i++)
            if (this[field][i] !== this.userInfo[field][i])
              return true
          return false
        }
        return true
      }
    },

    validate() {
      return !(
        this.sameField('personality') &&
        !this.notSameArray('likes') &&
        !this.notSameArray('dislikes') &&
        this.samePref('gpMale') &&
        this.samePref('gpFemale') &&
        this.samePref('gpGay') &&
        this.samePref('gpLesbian') &&
        this.samePref('gpBi')
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
    editProfile() {
      if (this.validate) {
        let update = {
          personality: this.personality,
          likes: this.likes,
          dislikes: this.dislikes,
          gpMale: this.gpMale,
          gpFemale: this.gpFemale,
          gpGay: this.gpGay,
          gpLesbian: this.gpLesbian,
          gpBi: this.gpBi
        }

        this.$store.dispatch('setLoading', true)

        this.$store.dispatch('editProfileInterest', { update, userID: this.user._id })
          .then(updated => {
            let { genderpref } = updated
            delete update.genderpref
            
            this.userInfo = updated
            this.userInfo.gpMale = genderpref.includes('m')
            this.userInfo.gpFemale = genderpref.includes('f')
            this.userInfo.gpGay = genderpref.includes('g')
            this.userInfo.gpLesbian = genderpref.includes('l')
            this.userInfo.gpBi = genderpref.includes('b')

            this.$store.dispatch('setDialog', {
              show: true,
              header: 'Edit Success',
              msg: 'Profile successfully editted'
            })
          })
          .catch(err => {
            console.log(err)
            this.$store.dispatch('setDialog', {
              header: 'Error',
              msg: 'Profile has not been changed'
            })
          })
          .finally(() => {
            this.$store.dispatch('setLoading', false)
          })
      }
    },

    setField(field) {
      this[field] = this.userInfo[field]
    },
  },

  created() {
    // set user info to the values
    const { personality, likes, dislikes, genderpref } = this.user.userInfo
    this.userInfo = { personality }
    // set genderpref
    this.userInfo.gpMale = genderpref.includes('m')
    this.userInfo.gpFemale = genderpref.includes('f')
    this.userInfo.gpGay = genderpref.includes('g')
    this.userInfo.gpLesbian = genderpref.includes('l')
    this.userInfo.gpBi = genderpref.includes('b')

    let keys = Object.keys(this.userInfo)
    for (let i = 0; i < keys.length; i++) {
      this.setField(keys[i])
    }

    this.userInfo.likes = []
    this.userInfo.dislikes = []

    for (let i = 0; i < likes.length; i++) {
      this.likes.push(likes[i])
      this.userInfo.likes.push(likes[i])
    }

    for (let i = 0; i < dislikes.length; i++) {
      this.dislikes.push(dislikes[i])
      this.userInfo.dislikes.push(dislikes[i])
    }
  }
}
</script>