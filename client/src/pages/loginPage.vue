<template>
<div id="bg" class="w-screen h-screen flex justify-center items-center bg-light-main">
  <div id="back" class="navbar px-4 py-4 text-white font-black">
    <img src="@/assets/images/back.svg" class="cursor-pointer grow" @click="$router.push('/')" /> 
  </div>
  <div id="loginModal" class="bg-white rounded-lg m-3 p-10 shadow-lg">
    <h1 class="text-2xl font-black text-dark-grey mb-5">
      Log in to your account
    </h1>
    <div class="text-red-600">{{ errors.msg }}</div>
    <form @submit.prevent>
      <div class="mb-4 flex flex-col">
        <label class="mb-2" for="email">Email</label>
        <input class="px-3 py-2" v-model="email"
            type="email" id="email" name="email" required>
        <div class="text-red-600">{{ errors.email }}</div>
      </div>
      <div class="mb-4 flex flex-col">
        <label class="mb-2" for="password">Password</label>
        <input class="px-3 py-2" type="password" v-model="password"
            id="password" name="password">
        <div class="text-red-600">{{ errors.pass }}</div>
      </div>
      <div class="flex flex-col sm:flex-row justify-between w-8/10 mb-5">
        <span class="flex flex-row mr-10">
          <input class="mr-2" type="checkbox" v-model="rememberMe" id="terms" name="terms">
          <label class="self-center text-dark-grey">Remember me</label>
        </span>
        <label class="sm:self-center cursor-pointer" @click="$router.push('/register');">
          I don't have an account
        </label>
      </div>

      <div class="w-full flex justify-center">
        <button class="btn btn-rounded btn-gradient shadow-md grow"
          :class="classButton"
          :disabled="!validate"
          @click="login">Log in</button>
      </div>
    </form>
  </div>
</div>
</template>

<style src="@/App.css"></style>
<style scoped>
#bg {
  background-image: url(../assets/images/orangecouple.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

#loginModal {
  height: auto;
  width: max-content;
}

#back {
  position: absolute;
  top: 12px;
  left: 12px;
}

.grow:hover {
  transform: scale(1.02);
}
</style>

<script>
import UserService from '@/services/UserService';

export default {
  data() {  
    return {
      email: '',
      password: '',
      rememberMe: undefined,
      errors: {}
    }
  },

  methods: {
    login() {
      if (this.validate) {
        UserService.login(this.email.trim(), this.password.trim(), this.rememberMe)
          .then(res => {
            console.log(res);
            this.$router.replace('/chat');
          }).catch(err => {
            if (err.status === 401) {
              this.errors = err.data;
              console.log(this.errors);
            } else { // mostlikely error 500
              // TODO: Alert a 500
            }
          });
      }
    },
  },

  computed: {
    validate() {
      return this.email.trim() !== '' && this.password.trim() !== '';
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

