<template>
<div class="w-screen h-screen flex justify-center items-center bg-light-main">
  <div id="loginModal" class="bg-white rounded-lg m-3 p-10 shadow-lg">
    <h1 class="text-2xl font-black text-dark-grey mb-5">
      Admin User
    </h1>
    <div class="mb-4 flex flex-col">
      <label class="mb-2" for="user">User</label>
      <div class="text-red-600">{{ errors.user }}</div>
      <input class="px-3 py-2" v-model="user"
          type="text" id="uesr" name="user" required>
    </div>
    <div class="mb-4 flex flex-col">
      <label class="mb-2" for="password">Password</label>
      <div class="text-red-600">{{ errors.pass }}</div>
      <input class="px-3 py-2" type="password" v-model="password"
          id="password" name="password">
    </div>
    <button
      class="w-full h-12 text-base btn-primary mt-10"
      :class="classButton"
      :disabled="!validate"
      @click="login">Log in</button>
  </div>
</div>
</template>

<style src="@/App.css"></style>
<style scoped>
#loginModal {
  height: auto;
  width: max-content;
}
</style>

<script>
import AdminService from '@/services/AdminService';

export default {
  data() {  
    return {
      user: '',
      password: '',
      errors: {},
    }
  },

  methods: {
    login() {
      AdminService.login(this.user.trim(), this.password.trim())
        .then(() => this.$router.replace('/admin'))
        .catch(err => this.errors = err.data)
    },
  },

  computed: {
    validate() {
      return this.user.trim() !== '' && this.password.trim() !== ''
    },

    classButton() {
      return {
        highlight: this.validate,
        unhighlight: !this.validate
      }
    },
  },
}
</script>

