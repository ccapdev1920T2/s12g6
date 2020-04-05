<template>
<div class="h-screen w-screen overflow-y-scroll" id="bg">
  <!-- Navbar -->
  <!-- <div id="navbar" -->
  <div class="navbar w-screen flex items-center justify-between 
      px-12 py-6 text-white font-black">
    <router-link to="/" class="text-3xl md:text-4xl font-light logo cursor-pointer">
      anispark
    </router-link>
    <button id="login" class="btn-secondary grow" @click="$router.push('/login');">
      LOG IN
    </button>
  </div>  
 
  <!-- Body -->
  <div class="form-container-center p-4">
    <!-- Registration  -->
    <div class="form-wrapper-half main-form-wrapper">
      <div class="form-card bg-white p-8 shadow-lg rounded-lg">
        <div class="mb-5">
          <h1 class="text-2xl font-black text-dark-grey">
            Create a new account
          </h1>
        </div>
        <!-- Form -->
        <form class="h-full w-full items-center">
          <div class="mb-4 flex flex-col">
            <label class="mb-2" for="email">DLSU Email</label>
            <input class="px-3 py-2"
              v-model="email"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-2" for="phoneNum">Phone Number</label>
            <input
              class="px-3 py-2"
              v-model="phoneNumber"
              type="text"
              id="phoneNum"
              name="phoneNum"
              pattern="^(0|63)9[0-9].{8,8}$"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-2" for="password">Password</label>
            <input
              class="px-3 py-2"
              type="password"
              v-model="password"
              id="password"
              name="password"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-2" for="retypePassword">Retype Password</label>
            <input
              class="px-3 py-2"
              type="password"
              v-model="retypePassword"
              id="retypePassword"
              name="retypePassword"
              required
            />
          </div>
          <div class="flex flex-row w-8/10 mb-5">
            <input class="mr-3" type="checkbox" v-model="terms" id="terms" name="terms" />
            <label class="self-center">I accept the Terms of Service</label>
          </div>
        </form>

        <div class="div-btn btn-primary btn-rounded h-12 text-base" :class="classButton" 
          :disabled="!validate"
          @click="setUser">
          Sign Up
        </div>
      </div>
    </div>
  </div>
  <confirm-modal :email="email" v-if="isModalVisible" @close="closeModal" @resend="sendEmail" />
</div>
</template>

<style src="@/assets/stylesheets/highlights.css"></style>
<style src="@/assets/stylesheets/component-styles/register.css"></style>
<style src="@/assets/stylesheets/component-styles/home.css"></style>
<style src="@/assets/stylesheets/util/transitions.css"></style>
<style scoped>
#bg {
  background-image: url(../../assets/images/mainbg.jpg);  
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<script>
import UserService from "@/services/UserService";
import ConfirmModal from "@/components/register/confirm-modal.vue";

export default {
  data() {
    return {
      email: "",
      phoneNumber: "",
      password: "",
      retypePassword: "",
      terms: "",
      user: null,
      isModalVisible: false
    };
  },

  components: {
    ConfirmModal,
  },

  computed: {
    validateEmail() {
      return !(
        !this.email ||
        !this.email.match(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig
        )
      )
    },

    validatePhoneNumber() {
      return !(
        !this.phoneNumber ||
        !this.phoneNumber.match(/^(0|63)9[0-9].{8,8}$/ig)
      )
    },

    validatePassword() {
      return !(
        !this.password || this.password.length < 9 ||
        !this.retypePassword ||
        this.password != this.retypePassword
      )
    },

    passwordStrength() {
      return () => {
        let strength = 0
        const LOWER_ALPHA_REGEX = /[a-z]/ig
        const UPPER_ALPHA_REGEX = /[A-Z]/ig
        const NUMBER_REGEX = /[0-9]/ig
        const SYMBOL_REGEX = /[@$!%*#?&_.-]/ig
        
        if (this.password.match(LOWER_ALPHA_REGEX)) strength++
        if (this.password.match(UPPER_ALPHA_REGEX)) strength++
        if (this.password.match(NUMBER_REGEX)) strength++
        if (this.password.match(SYMBOL_REGEX)) strength++

        return strength > 2 // strength must be 3
      }
    },

    validate() {
      return (
        this.validateEmail &&
        this.validatePhoneNumber &&
        this.validatePassword &&
        this.terms
      );
    },

    classButton() {
      return {
        highlight: this.validate,
        unhighlight: !this.validate
      }
    }
  },

  methods: {
    sendEmail() {
      // TODO: Load
      UserService.postSendEmail(this.user)
        .then(() => this.isModalVisible = true)
        .catch(err => console.log(err)); // TODO: stop load and show err
    },

    setUser() {
      // show modal
      this.user = {
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password
      };
    
      this.isModalVisible = true;
      this.sendEmail();
    },

    closeModal() {
      this.isModalVisible = false;
      this.$router.push('/register/info');
    }
  },
};
</script>


 <!-- <div class="navbar px-8 py-6 md:px-12 text-white font-black">
    <router-link to="/" class="text-3xl md:text-4xl logo cursor-pointer">
      anispark
    </router-link>
    
    <router-link to="/login" tag="button" class="btn-secondary grow" id="login">
      LOG IN
    </router-link>
  </div> -->