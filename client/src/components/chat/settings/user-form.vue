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
    <h1 class="font-bold text-2xl text-dark-grey mb-3 self-start">
      User Details
    </h1>

    <!-- First and Last Name -->
    <div class="inline-form">
      <div id="firstName" class="inline-input sm:mr-2">
        <label class="mb-1" for="fname">First Name</label>
        <input v-model="fname" class="px-3 my-0" type="text" id="fname" required>
        {{ errors.fname }} <!-- TODO: backend error style -->
      </div>
      <div id="lastName" class="inline-input sm:ml-2">
        <label class="mb-1" for="lname">Last Name</label>
        <input v-model="lname" class="px-3 my-0" type="text" id="lname" required>
        {{ errors.lname }} <!-- TODO: backend error style -->
      </div>
    </div>
    
    <!-- Nickname and Birthday -->
    <div class="inline-form">
      <div id="nickname" class="inline-input sm:mr-2">
        <label class="mb-1" for="nick">Nickname</label>
        <input v-model="nickname" class="px-3 my-0" type="text" id="nick" required>
        {{ errors.nickname }} <!-- TODO: backend error style -->
      </div>

      <div id="birthday" class="inline-input sm:ml-2">
        <label class="mb-1" for="birthday">Birthday</label>
        <input v-model="birthday" class="px-3 my-0 w-full" type="date" id="bday" required>
        {{ errors.birthday }} <!-- TODO: backend error style -->
      </div>
    </div>

    <!-- Gender -->
    <div id="gender" class="normal-form">
      <label class="mb-1" for="gender">Gender</label>
      <select v-model="gender" name="gender" class="my-0" id="gender">
        <option v-for="(val, key) in genders" :key="key" :value="key" :selected="key === gender">{{ val }}</option>
      </select>
      {{ errors.gender }} <!-- TODO: backend error style -->
    </div>

    <!-- Religion -->
    <div id="religion" class="normal-form">
      <label class="mb-1" for="religion">Religion</label>
      <input v-model="religion" class="px-3 my-0" type="text" id="religion" required>
      {{ errors.religion }} <!-- TODO: backend error style -->
    </div>

    <!-- Address -->
    <div id="address" class="normal-form">
      <label class="mb-1" for="password">Address</label>
      <input v-model="address" class="px-3 my-0" type="text" id="address" required>
      {{ errors.address }} <!-- TODO: backend error style -->
    </div>
    
    <!-- <div id="buttonWrapper"> -->
    <center>
      <button class="btn btn-primary btn-rounded my-5"
        :class="classButton"
        @click="editProfile"
        :disabled="!validate">
          Save Changes
      </button> 
    </center>
    <!-- </div> -->
    
    <center v-if="!dialog" class="cursor-pointer text-light-grey "
      @click="dialog = !dialog">
      Delete my account
    </center>
    <!-- TODO: Make a dialog to ask whether yes or no -->
    <center v-if="dialog" class="flex flex-row">
        <button class="flex-1 bg-red-600 mx-12 py-1 btn-rounded" @click="deleteAccount"><b>Yes</b></button>
        <button class="flex-1 mx-12 py-1 border-4 btn-rounded" @click="dialog = !dialog"><b class="text-black">No</b></button>
    </center>
  </form>
  
</div>
</template>

<style src="@/assets/stylesheets/component-styles/settings-form.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/user-form.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/settings.css" scoped></style>
<style src="@/assets/stylesheets/highlights.css"></style>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      errors: {},
      fname: '',
      lname: '',
      address: '',
      userInfo: {},
      dialog: false,
      genders: {
        male: 'Male',
        female: 'Female',
        gay: 'Gay',
        lesbian: 'Lesbian',
        bi: 'Bisexual'
      },
    }
  },

  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    sameField() {
      return function (field) {
        return this[field].trim() === '' || this[field].trim() === this.userInfo[field]
      }
    },

    validate() {
      return !(
        this.sameField('fname') && 
        this.sameField('lname') &&
        this.sameField('nickname') &&
        this.sameField('birthday') &&
        this.sameField('gender') &&
        this.sameField('religion') &&
        this.sameField('address')
      )
    },

    classButton() {
      return { highlight: this.validate, unhighlight: !this.validate }
    }
  },

  methods: {
    editProfile() {
      if (this.validate) {
        let update = {
          fname: this.fname.trim(),
          lname: this.lname.trim(),
          nickname: this.nickname.trim(),
          birthday: this.birthday.trim(),
          gender: this.gender.trim(),
          religion: this.religion.trim(),
          address: this.address.trim()
        }

        // set loading to true
        this.$store.dispatch('setLoading', true)

        this.$store.dispatch('editProfileInfo', { update, userID: this.user._id })
          .then(update => {
            this.userInfo = update
            this.$store.dispatch('setDialog', {
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

    deleteAccount() {
      this.$store.dispatch('deleteAccount', this.user._id)
        .then(() => this.$router.push('/'))
        .catch(err => {
          console.log(err)
          this.$store.dispatch('setDialog', {
            header: 'Couldn\'t Delete',
            msg: 'Something went wrong'
          })
        })
    }
  },

  created() {
    // set user info to the values
    const { fname, lname, nickname, birthday, gender, religion, address } = this.user.userInfo
    this.userInfo = { fname, lname, nickname, birthday, gender, religion, address }
    // set all textbox with the value from this.userInfo
    let keys = Object.keys(this.userInfo)
    for (let i = 0; i < keys.length; i++) {
      this.setField(keys[i])
    }
  },
}
</script>