<template>
  <div>
    <loading v-if="loading" :bg="true"/>
    <dialog-item v-if="dialog" :header="header" :msg="msg"/>
    <error-item v-if="error" :error="errnum" :message="msg"/>
    <div v-if="!error" class="h-screen w-screen overflow-y-scroll" id="bg">
      <div class="navbar px-4 pt-4 text-white font-black">
        <img src="@/assets/images/back.svg" class="cursor-pointer" @click="backToInterest" />
      </div>

      <!-- Body -->
      <div class="form-container p-4">
        <!-- Form-->
        <div class="form-wrapper-half" id="imgFormWrapper">
          <div class="form-card bg-white px-2 py-8 md:p-10 shadow-lg rounded-lg">
            <!-- Title -->
            <!-- <div class="xl:mb-5"> -->
            <div>
              <h1 class="text-xl font-black text-dark-grey md:text-2xl" id="title">
                Upload your best shots!
              </h1>
              <p class="text-sm">Upload three photos of yourself.</p>
            </div>

            <!-- Form -->
            <form id="imgForm" class="h-full w-full xl:my-5" enctype="multipart/form-data" @submit.prevent>
              <!-- Before upload -->
              <div id="dpView" class="m-5" v-show="isImageEmpty">
                <label for="file-input">
                  <img id="imageUploadInput" class="dp-main-img cursor-pointer" src="@/assets/images/upload.svg" />
                </label>
                <input class="hidden" accept="image/*" @change="onFileSelected($event)" 
                  id="file-input" ref="fileMain" type="file"/>
              </div>

              <!-- After upload -->
              <div id="dpView" class="m-5 xl:my-0" v-show="!isImageEmpty">
                <!-- Main Image -->
                <div id="dpMainWrapper shadow-lg">
                  <img class="dp-main-img rounded-lg shadow-lg" :src="mainImage" 
                    v-if="files.length > 0" />
                </div>

                <!-- Other User Images -->  
                <div class="flex justify-center w-full overflow-scroll p-2">
                  <image-icon :url="img.image" id="imgIcon" idName="imageIconRow"
                    v-for="(img, index) in files" :key="index"
                    :isImage="true"
                    @viewImage="viewImage(img.image, index)" 
                    @removeImage="removeImage(index)" />

                  <!-- Upload Buttons -->
                  <div v-if="!isImageFull">
                    <label for="file-input">
                      <image-icon id="imgIcon" idName="imageIconRow" 
                        :url="require('@/assets/images/addnew.svg')" 
                        :isImage="false" />
                    </label>
                    <input class="hidden" id="file-input" @change="onFileSelected($event)" ref="hidden" type="file" />
                  </div>
                </div>
              </div>
            </form>

            <div class="div-btn btn-primary btn-rounded h-12 text-base"
              :class="classButton"
              @click="register">
              <span>Finish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style src="@/assets/stylesheets/highlights.css"></style>
<style src="@/assets/stylesheets/component-styles/register.css" scoped></style>
<style src="@/assets/stylesheets/component-styles/picture-form.css" scoped></style>
<style scoped>
#dpView {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#bg {
  background-image: url(../../assets/images/profile/selfie.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

#imgFormWrapper {
  width: max-content;
}

#imgIcon {
  margin-left: 9px;
  margin-right: 9px;
}
</style>

<script>
import UserService from '@/services/UserService'

import ImageIcon from '@/components/register/image-icon.vue'
import Loading from '@/components/loading.vue'
import DialogItem from '@/components/dialog-item.vue'
import ErrorItem from '@/components/error-item.vue'

export default {
  data() {
    return {
      mainImage: null,
      mainImageIndex: -1,
      files: [],
      loading: false,
      dialog: false,
      error: false,
      errnum: 0,
      msg: '',
    }
  },

  components: {
    ImageIcon,
    Loading,
    DialogItem,
    ErrorItem,
  },

  computed: {
    isImageEmpty() {
      return this.files.length === 0
    },

    isImageFull() {
      return this.files.length === 3
    },

    classButton() {
      let classes = {
        highlight: !this.isImageEmpty,
        unhighlight: this.isImageEmpty
      }
      return classes
    }
  },

  methods: {
    onFileSelected(e) {
      if (this.files.length < 3) {
        this.createImage(e)
      }
    },

    createImage(ev) {  
      const reader = new FileReader()

      reader.onload = (e) => {
        this.mainImageIndex = this.files.length
        this.mainImage = e.target.result
        this.files.push({
          image: e.target.result,
          file: this.$refs.fileMain.files[0]
        })
      }
      
      reader.readAsDataURL(ev.target.files[0])
    },

    viewImage(image, index) {
      this.mainImage = image
      this.mainImageIndex = index
    },

    removeImage(index) {
      this.files.splice(index, 1)

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

    async register() {
      this.loading = true
      try {
        // registration for fields
        let userID = await UserService.postRegister(this.$route.query)
        userID = userID.data

        // put the dp in the backend
        let formData = new FormData()
        formData.append('dp', this.files[this.mainImageIndex].file)

        await UserService.postDP(formData, userID)
        formData.delete('dp')
        let notUploaded = 0

        for (let i = 0; i < this.files.length; i++) {
          if (this.mainImageIndex !== i) {
            formData.append('image', this.files[i].file)
            
            await UserService.postImage(formData, userID)
              .catch(err => {
                console.log(err)
                notUploaded++
              })
            
            formData.delete('image')
          }
        }

        if (notUploaded > 0) {
          alert(`${notUploaded} photo${notUploaded > 1 ? 's were' : ' was'} not uploaded.`)
        }
        
        this.$router.push({ path: '/chat' })
      } catch(err) {
        // dp not uploaded
        console.log(err)
        if (err.status === 401 && err.data instanceof Object) {
          this.header = 'Incorrect Fields'
          for (let key in err.data)
            this.msg += `*${err.data[key]}\n`
          this.dialog = true
        } else {
          this.errnum = err.status
          this.msg = err.data
          this.error = true
        }
      }
      this.loading = false
    },

    backToInterest() {
      this.$router.push({
        path: '/register/interest',
        query: this.$route.query
      })
    }
  }
}
</script>