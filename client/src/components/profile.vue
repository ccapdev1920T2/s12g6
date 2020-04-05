<template>
<div id="profileContainer" class="bg-white shadow-lg rounded-lg text-dark-grey">
  <!-- Details -->
  <section id="detailSection" class="p-4">
    <div id="detailContent">
      <!-- Back Button -->
      <img id="backButtonTop"
        class="absolute shadow-md rounded-full icon-top-left cursor-pointer" 
        src="@/assets/images/back.svg"
        @click="hideMatch">

      <!-- About (Top Half) -->
      <section id="about" class="my-3 lg:m-0">
        <h1 class="text-hot-pink font-bold">about</h1>
        <h1 class="text-2xl lg:text-3xl font-bold leading-tight">
          {{ userInfo.fname }} {{ userInfo.lname }}
        </h1>

        <!-- Basic Details -->
        <div class="my-1 lg:my-3">
          <h1 class="sm:text-lg md:text-2xl">
            {{ age }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ userInfo.gender }}
          </h1>
          <h1 class="text-md">{{ userInfo.address }}</h1>
        </div>

        <!-- Bio -->
        <p class="text-sm lg:text-md">{{ userInfo.bio }}</p>
      </section>

      <!-- Likes and Dislikes (Bottom Half) -->
      <section id="interests" class="flex w-5/6 my-3">
        <div class="lg:my-5 w-1/2" id="likes">
          <h1 class="text–3xl text-hot-pink font-bold">likes</h1>
          <ul class="mx-5">
            <li class="list-disc text-sm lg:text-md mb-2"
              v-for="(like, index) in userInfo.likes"
              :key="index">
              {{ like }}
            </li>
          </ul>
        </div>
        <div class="lg:my-5 w-1/2">
          <h1 class="text–3xl text-hot-pink font-bold">dislikes</h1>
          <ul class="mx-5">
            <li class="list-disc mb-2 text-sm lg:text-md"
              v-for="(dislike, index) in userInfo.dislikes"
              :key="index">
              {{ dislike }}
            </li>
          </ul>
        </div>
      </section>

      <span id="reportUser" class="text-hot-pink text-sm cursor-pointer" 
        @click="$emit('openSettings')" v-if="id === user._id">    
        Edit profile
      </span>

      <span id="reportUser" class="text-hot-pink text-sm cursor-pointer" 
        @click="$emit('openReport')" v-else>
        Report this user
      </span>
    </div>
  </section>

  <!-- Image Section -->
  <section id="imageSection">
    <div id="imageContent">
      <!-- Back Button -->
      <img id="backButtonBelow" 
        class="absolute shadow-md rounded-full icon-top-left cursor-pointer" 
        src="@/assets/images/back.svg"
        @click="hideMatch">
      
      <!-- Left Arrow -->
      <img id="profileLeft" src="@/assets/images/profile-left.svg" 
        class="shadow-lg rounded-full cursor-pointer grow" 
        @click="viewPrev"/>

      <!-- Main Image -->
      <img :src="currentImage" id="imgMain">
      
      <!-- Right Arrow -->
      <img id="profileRight" src="@/assets/images/profile-right.svg"   
        class="shadow-md rounded-full cursor-pointer grow"
        @click="viewNext" />

      <!-- Match/Unmatch -->
      <div id="matchUnmatch" class="w-auto h-24 rounded-lg m-2 lg:m-3 lg:rounded-none"
        v-if="!isSelfViewing && showLikesDislikes">
        <!-- Like Button -->
        <img
          @click="like"
          src="@/assets/images/heart.svg"
          class="match-unmatch-button" />
        <!-- Dislike Button -->
        <img
          @click="dislike"
          src="@/assets/images/dislike.svg"
          class="match-unmatch-button" />
      </div>
    </div>
  </section>
</div>
</template>

<style src="@/App.css"></style>
<style src="@/assets/stylesheets/component-styles/profile.css" scoped></style>
<style src="@/assets/stylesheets/util/transitions.css" scoped></style>

<script>
import config from '@/config'
import { mapGetters } from 'vuex'
const moment = require('moment')

export default {
  data() {
    return {
      imgInd: 0
    }
  },

  props: {
    id: String,
    userInfo: {
      type: Object,
      validator(obj) {
        const { fname, lname, gender, address, birthday, likes, dislikes } = obj
        return fname && lname && gender && address && birthday && likes && dislikes
      }
    },
    images: Array,
    dp: String,
    type: String,
    showLikesDislikes: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    isSelfViewing() {
      return this.user._id === this.id
    },

    age() {
      return moment(Date.now()).diff(this.userInfo.birthday, 'years')
    },

    currentImage() {
      return `${config.SERVER_URL}/images/users/${this.id}/${this.images[this.imgInd]}`
    }
  },

  methods: {
    like() {
      this.$emit('initChat')
    },

    dislike() {
      this.$emit('unmatchMatch')
    },

    hideMatch() {
      this.$emit('hideMatch')
    },

    viewPrev() {
      this.imgInd--
      if (this.imgInd < 0) this.imgInd += this.images.length
    },

    viewNext() {
      this.imgInd = (this.imgInd + 1) % this.images.length
    },
  },

  created() {
    this.imgInd = this.images.indexOf(this.dp)
  },

  watch: {
    images() {
      this.imgInd = this.images.indexOf(this.dp)
    }
  }
}
</script>