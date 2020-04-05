<template>
<div class="h-screen w-screen overflow-y-scroll" id="bg">
  <div class="navbar px-4 py-4 text-white font-black">
    <img src="@/assets/images/back.svg" class="cursor-pointer" @click="$router.push('/register')" /> 
  </div>

  <!-- Body -->
  <div class="form-container">
    <!-- Registration  -->
    <div class="form-wrapper-half">
      <div class="form-card bg-white shadow-lg rounded-lg p-8">
        <div class="mb-5">
          <h1 class="text-2xl font-black text-dark-grey" id="title">
            Fill in your details 
          </h1>
        </div>

        <!-- Form -->
        <form class="h-full w-full items-center mb-5" @submit.prevent>
          <div class="flex flex-col p-0 sm:flex-row">
            <div class="mb-4 mr-2 w-full flex flex-col">
              <label class="mb-2" for="fname">First Name</label>
              <input v-model="fname" class="px-3 py-2" type="text" id="fname" required>
            </div>
            <div class="mb-4 w-full flex flex-col">
              <label class="mb-2" for="lname">Last Name</label>
              <input v-model="lname" class="px-3 py-2" type="text" id="lname" required>
            </div>
          </div>

          <div class="flex flex-col p-0 sm:flex-row">
            <div class="mb-4 mr-2 w-full flex flex-col">
              <label class="mb-2" for="nick">Nickname</label>
              <input v-model="nickname" class="px-3 py-2" type="text" id="nick" required>
            </div>
            <div class="mb-4 w-full flex flex-col">
              <label class="mb-2" for="birthday">Birthday</label>
              <input v-model="birthday" class="px-3 py-2" type="date" id="bday" required>
            </div>
          </div>

          <div class="mb-4 flex flex-col">
            <label class="mb-2" for="gender">Gender</label>
            <select v-model="gender" name="gender" class="px-2 focus:outline-none" id="gender">
              <!-- <option v-for="gname in genderList" :key="gname" :value="gname">{{ capitalize(gname) }}</option> -->
              <option v-for="(val, key) in genders" :key="val" :value="key">{{ val }}</option>
            </select>
          </div>

          <div class="mb-4 flex flex-col">
            <label class="mb-2" for="religion">Religion</label>
            <input v-model="religion" class="px-3 py-2" type="text" id="religion" required>
          </div>

          <div class="mb-5 flex flex-col">
            <label class="mb-2" for="password">Complete Address</label>
            <input v-model="address" class="px-3 py-2" type="text" id="address" required>
          </div>
        </form>

        <div class="div-btn btn-primary btn-rounded h-12 text-base"
          :class="classButton"
          :disabled="!validate"
          @click="nextPage">Next</div>
      </div>
    </div>
  </div>
</div>
</template>

<style src="@/assets/stylesheets/highlights.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/register.css" scoped></style>
<style scoped>
#bg {
  background-image: url(../../assets/images/orangecouple.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
<script>
export default {
    data() {
      return {
        fname: this.$route.query.fname || '',
        lname: this.$route.query.lname || '',
        nickname: this.$route.query.nickname || '',
        gender: this.$route.query.gender || '',
        birthday: this.$route.query.birthday || '',
        religion: this.$route.query.religion || '',
        address: this.$route.query.address || '',
        genders: {
          male: 'Male',
          female: 'Female',
          gay: 'Gay',
          lesbian: 'Lesbian',
          bi: 'Bisexual'
        },
        // genderList: [ 'male', 'female', 'gay', 'lesbian', 'bisexual' ]
      }
    },

    methods: {
      // capitalize: (text) => `${text.charAt(0).toUpperCase()}${text.substring(1)}`,
      
      nextPage() {
        this.$router.push({
          path: '/register/interest',
          query: {
            ...this.$route.query,
            fname: this.fname.trim(),
            lname: this.lname.trim(),
            nickname: this.nickname.trim(),
            gender: this.gender.trim(),
            birthday: this.birthday.trim(),
            religion: this.religion.trim(),
            address: this.address.trim()
          }
        });
      },
    },

    computed: {
        validateEmpty() {
          return (
            this.fname.trim() !== '' &&
            this.lname.trim() !== '' &&
            this.nickname.trim() !== '' &&
            this.gender.trim() !== '' &&
            this.birthday.trim() !== '' &&
            this.religion.trim() !== '' &&
            this.address.trim() !== ''
          );
        },

        validateDate() {
          return /^[0-9]{4,4}-((0[1-9])|(1[0-2]))-(([0-2][0-9])|(3[0-1]))$/
            .test(this.birthday);
        },

        validateBirthday() {
          return (new Date()).getTime() > (new Date(this.birthday)).getTime()
        },

        validate() {
          return (
            this.validateEmpty &&
            this.validateDate &&
            this.validateBirthday
          );
        },
        
        classButton() {
          return {
            highlight: this.validate,
            unhighlight: !this.validate
          };
        },
    },
}
</script>
