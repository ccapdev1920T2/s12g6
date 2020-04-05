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

  <form class="form-content pt-10 lg:pt-5 pb-5 m-0" enctype="multipart/form-data" @submit.prevent>
    <h1 class="font-bold text-2xl text-dark-grey mb-3">
      Upload your Best Shots!
    </h1>

    <!-- Before upload -->
    <div id="imageUploadInput" class="m-10" v-show="isImageEmpty">
      <label for="file-input">
        <img class="cursor-pointer" src="@/assets/images/upload.svg" />
      </label>
      <input class="hidden" accept="image/*" @change="onFileSelected($event)" 
        id="file-input" ref="fileMain" type="file"/>
    </div>

    <!-- After upload -->
    <div id="dpView" class="my-5" v-show="!isImageEmpty">
      <!-- Main Image -->
      <div id="dpMainWrapper">
      <img class="dp-main-img rounded-lg" :src="mainImage" v-if="files.length > 0" />
      </div>

      <!-- Other User Images -->  
      <div id="dpOther">
        <div id="uploadedImg" v-for="(img, index) in files" :key="index">
          <image-icon :url="img.image" idName="imageIcon" 
            :isImage="true"
            :atRegistration="false"
            @viewImage="viewImage(img.image, index)" 
            @removeImage="removeImage(index)" />
        </div>

        <!-- Upload Buttons -->
        <div id="imageUploadChild">
          <label for="file-input" v-for="i in netImages" :key="i">
            <img class="cursor-pointer" src="@/assets/images/addnew.svg" id="addNew" />
          </label>
          <input class="hidden" id="file-input" @change="onFileSelected($event)" ref="hidden" type="file" />
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div id="buttonWrapper">
      <button 
        class="btn btn-primary btn-rounded my-3"
        :class="classButton"
        :disabled="!validateUpdate"
        @click="updateImages">
          Save Changes
      </button> 
    </div>
  </form>
</div>
</template>

<style src="@/assets/stylesheets/component-styles/settings-form.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/settings-picture-form.css" scoped></style>

<script>
import config from '@/config'
import { mapGetters } from "vuex"
import ImageIcon from "@/components/register/image-icon.vue"
import UserService from '@/services/UserService'

export default {
  data() {
    return {
      mainImage: null,
      mainImageIndex: -1,
      files: [],
      removedFiles: [],
      numImage: 0,
      maxImages: 5,
      addedNewFile: false
    }
  },
  
  components: {
    ImageIcon,
  },
  
  computed: {
    ...mapGetters({
      user: 'getCurrentUser'
    }),

    isImageEmpty() {
      return this.files.length === 0
    },

    isImageFull() {
      return this.files.length === this.maxImages
    },

    netImages() {
      return this.maxImages - this.files.length
    },

    classButton() {
      let classes = {
        highlight: this.validateUpdate,
        unhighlight: !this.validateUpdate
      }
      return classes
    },

    validateUpdate() {
      return (
        this.user.dp !== this.files[this.mainImageIndex].filename ||
        this.removedFiles.length > 0 ||
        this.addedNewFile
      )
    }
  },

  methods: {
    onFileSelected(e) {
      if (this.files.length < this.maxImages) {
        this.createImage(e)
      }
    },

    createImage(ev) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.files.push({
          image: e.target.result,
          file: this.$refs.fileMain.files[0],
          new: true
        })
        this.addedNewFile = true
      }

      reader.readAsDataURL(ev.target.files[0])
    },

    viewImage(image, index) {
      this.mainImage = image
      this.mainImageIndex = index
    },

    removeImage(index) {
      const [ image ] = this.files.splice(index, 1)

      if (image.new === false)
        this.removedFiles.push(image.filename)

      if (this.files.length > 0) {
        if (this.mainImageIndex > index) {
          this.mainImageIndex--
        } else if (this.mainImageIndex === index) {
          this.mainImageIndex = Math.max(0, index - 1)
          this.mainImage = this.files[this.mainImageIndex].image
        }
      } else {
        this.mainImageIndex = -1
      }
    },

    async updateImages() {
      // update dp
      let errors = []
      this.$store.dispatch('setLoading', true)
      let formData = new FormData()
      let notUploaded = 0
      let image = this.files[this.mainImageIndex]

      try {
        if (this.user.dp !== image.filename) {
          if (image.new === true) {
            formData.append('dp', image.file)
            let dp = await UserService.postDP(formData, this.user._id)
            formData.delete('dp')
            this.$store.dispatch('editDP', dp.data)
          } else {
            // just patch the name
            let dp = await UserService.editDP(image.filename, this.user._id)
            this.$store.dispatch('editDP', dp.data)
          }
          this.mainImageChanged = false
        }
      } catch(err) {
        console.log(err);
        errors.push('DP not changed')
      }

      // remove and delete files
      if (this.removedFiles.length > 0) {
        try {
          let removed = await UserService.editRemoveImages(this.removedFiles, this.user._id)
          this.$store.dispatch('editRemoveImages', removed.data)
        } catch(err) {
          console.log(err)
          errors.push('Old images not removed')
        }
      }

      let newImage = ''
      // add the files/images
      for (let i = 0; i < this.files.length; i++) {
        if (this.mainImageIndex !== i && this.files[i].new) {
          formData.append('image', this.files[i].file)
          
          try {
            newImage = await UserService.postImage(formData, this.user._id)
            newImage = newImage.data

            this.files[i].filename = newImage
            this.files[i].image = this.getImgPath(newImage)
            this.files[i].new = false
            delete this.files[i].file
            this.$store.dispatch('addNewImage', newImage)
          } catch (err) {
            console.log(err)
            notUploaded++
          }

          formData.delete('image')
        }
      }

      if (notUploaded > 0) {
        errors.push(`${notUploaded} photo${notUploaded > 1 ? 's were' : ' was'} not uploaded.`)
      } else {
        this.addedNewFile = false
      }

      this.removedFiles = []
      if (errors.length > 0) {
        let msg = ''
        errors.forEach(err => msg += `${err}\n`)
        msg = msg.substring(0, msg.length - 1)
        this.$store.dispatch('setDialog', {
          header: errors.length === 1 ? 'Error' : 'Errors',
          msg
        })
      } else {
        this.$store.dispatch('setDialog', {
          header: 'Images Changed',
          msg: 'Images were changed'
        })
      }
      this.$store.dispatch('setLoading', false)
    },

    getImgPath(img) {
      return `${config.SERVER_URL}/images/users/${this.user._id}/${img}`
    }
  },

  created() {
    let filename = ''
    let dp = this.user.dp
    this.mainImage = this.getImgPath(this.user.dp)
    this.mainImageChanged = false

    // Other pictures
    for (let i = 0; i < this.user.images.length; i++) {
      filename = this.user.images[i]
      if (filename === dp) {
        this.mainImageIndex = i
      }

      this.files.push({
        image: this.getImgPath(filename),
        filename: filename,
        new: false
      })
    }
  }
}
</script>