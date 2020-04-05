<template>
<div class="h-screen w-screen overflow-y-scroll" id="bg">
  <div class="navbar px-4 py-4 text-white font-black">
    <img src="@/assets/images/back.svg" class="cursor-pointer" @click="backToInfo" />
  </div>

  <!-- Body -->
  <div class="form-container p-4" @submit.prevent>
    <!-- Registration  -->
    <div class="form-wrapper-half">
      <div class="form-card bg-white p-8 shadow-lg rounded-lg">
        <div class="mb-5">
          <h1 class="text-2xl font-black text-dark-grey" id="title">
            Tell us more about you
          </h1>
        </div>

        <!-- Form -->
        <form class="h-full w-full items-center">
          <div class="mb-4 w-full flex flex-col">
            <label for="personality" class="mb-2">
              What is your Personality?
              <i class="text-dark-grey">(This will be your bio)</i>
            </label>
            <textarea name="personality" id="personality" class="resize-none p-2"
              v-model="personality" cols="30" rows="5"></textarea>
          </div>
          <div class="mb-4 w-full flex flex-col">
            <div class="relative">
              <label for="likes" class="mb-2">Likes</label>
              <font-awesome-icon 
                class="mx-2 text-sm text-hot-pink cursor-pointer"
                @mouseover="showingInfo = true"
                @mouseleave="showingInfo = false" 
                icon="question-circle" /> 

              <transition name="fade">
                <hover-text v-if="showingInfo" />
              </transition>
            </div> 
            <input-chips :chips="likes" :limit="5" />
            <!-- <input type="text" class="px-2" name="likes" v-model="likesText" required /> -->
          </div>
          <div class="mb-4 w-full flex flex-col">
            <label for="dislikes" class="mb-2">Dislikes</label>
            <input-chips :chips="dislikes" :limit="5" />
            <!-- <input type="text" class="px-2" name="dislikes" v-model="dislikesText" required /> -->
          </div>
          <!-- Hove text -->
          <!-- To Add a like or dislike just type a word or phrase then press enter <br> -->
          <div class="mb-4 w-full flex flex-col" id="genders">
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
        </form>

        <div class="div-btn btn-primary btn-rounded h-12 text-base"
          :class="classButton"
          :disabled="!validate"
          @click="nextPage"
        >Next</div>
      </div>
    </div>
  </div>
</div>
</template>

<style src="@/assets/stylesheets/component-styles/register.css" scoped></style>
<style src="@/assets/stylesheets/highlights.css" scoped></style>
<style src="@/assets/stylesheets/type-picker.css" scoped></style>
<style scoped>
#bg {
  background-image: url(../../assets/images/coffee.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

<script>
import InputChips from '@/components/input-chips.vue';
import HoverText from '@/components/hover-text.vue';

export default {
  data() {
    return {
      personality: this.$route.query.personality || '',
      likes: this.toArray(this.$route.query.likes),
      dislikes: this.toArray(this.$route.query.dislikes),
      gpMale: this.$route.query.gpMale || false,
      gpFemale: this.$route.query.gpFemale || false,
      gpGay: this.$route.query.gGay || false,
      gpLesbian: this.$route.query.gpLesbian || false,
      gpBi: this.$route.query.gpBi || false,

      showingInfo: false
    };
  },

  components: {
    InputChips,
    HoverText
  },

  methods: {
    toArray(array) {
      if (array instanceof Array)
        return array;
      else if (typeof(array) === 'string')
        return [ array ];
      else
        return [];
    },

    nextPage() {
      let genderpref = {};
      if (this.gpMale) genderpref.gpMale = true;
      if (this.gpFemale) genderpref.gpFemale = true;
      if (this.gpGay) genderpref.gpGay = true;
      if (this.gpLesbian) genderpref.gpLesbian = true;
      if (this.gpBi) genderpref.gpBi = true;

      this.$router.push({
        path: '/register/pic',
        query: {
          ...this.$route.query,
          personality: this.personality.trim(),
          likes: this.likes,
          dislikes: this.dislikes,
          ...genderpref
        }
      });
    },

    backToInfo() {
      this.$router.push({
        path: '/register/info',
        query: {
          ...this.$route.query
        }
      })
    },
  },

  computed: {
    validateEmpty() {
      return (
        this.personality.trim() !== "" &&
        this.likes.length > 0 &&
        this.dislikes.length > 0
      );
    },

    // at least 1 is checked
    validateGenderPref() {
      return (
        this.gpMale || this.gpFemale ||
        this.gpGay || this.gpLesbian ||
        this.gpBi
      );
    },

    validate() {
      return this.validateEmpty && this.validateGenderPref;
    },

    classButton() {
      return {
        highlight: this.validate,
        unhighlight: !this.validate
      };
    },
  },
};
</script>

