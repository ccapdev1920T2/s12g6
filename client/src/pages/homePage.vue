<template>
<transition name="fade" mode="out-in">
<div class="h-screen w-screen">
  <img class="absolute h-full w-full object-cover" :src="mainImage" />
  <div id="navbar"
    class="absolute z-30 w-screen flex items-center justify-between 
      px-12 py-6 text-white font-black">
    <router-link to="/" class="text-3xl md:text-4xl font-light logo cursor-pointer">
      anispark
    </router-link>
    <router-link to='/about' class="font-normal">
      ABOUT US
    </router-link>
    <button id="login" class="btn-secondary grow" @click="$router.push('/login');">
      LOG IN
    </button>
  </div>  

  <div class="absolute z-20 h-screen w-screen flex flex-col items-center justify-center text-white">
    <h1 class="font-black m-3">
      <i id="landing">find your new anispark</i>
    </h1>
    <button class="btn-primary md:shadow-md font-bold mb-20 grow" id="signup" @click="$router.push('/register');">
      SIGN UP
    </button> 
  </div>
</div>
</transition>
</template>

<style src="@/assets/stylesheets/util/transitions.css"></style>
<style src="@/assets/stylesheets/component-styles/home.css"></style>
<style scoped>
#overlay {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 20;
  background-color: #00000033;
}
</style>

<script>

export default {
  data() {
    return {
      bgImages: [
        require('@/assets/images/mainbg.jpg'),
        require('@/assets/images/home1.jpg'),
        require('@/assets/images/home2.jpg'),
        require('@/assets/images/home3.jpg')
      ],
      mainImage: require('@/assets/images/home1.jpg'),
      curImg: 0
    }
  },

  created() {
    setInterval(() => {
      let val = this.curImg;
      this.curImg = (val + 1) % 4;
      this.mainImage = this.bgImages[this.curImg];
    }, 10000);
  },
}
</script>
