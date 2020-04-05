<template>
<transition name="fade">
  <div v-if="show" class="flex modal-backdrop z-50">
    <div id="modal" class="modal shadow-lg">
      <header class="modal-header">
        <slot name="header">
          <h1 class="text-xl font-normal">{{ header }}</h1>
          <button type="button" class="btn-close" @click="showDialog = false">
            <img src="@/assets/images/y.svg" alt="">
          </button>
        </slot>
      </header>
      <br>
      <section class="modal-body">
        <slot name="body">
          <p>{{ msg }}</p>
          <br>
          <!-- Make a Timer -->
          <button class="flex justify-center text-link" @click="showDialog = false">Close</button>
        </slot>
      </section>
    </div>
  </div>
</transition>
</template>

<style src="@/App.css"></style>
<style src="@/assets/stylesheets/modal.css"></style>
<style scoped>
#modal {
  display: flex;
  flex-direction: column;
}

.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<script>
export default {
    props: {
        header: String,
        msg: String,
        show: {
            type: Boolean,
            default: true
        }
    },

    computed: {
      showDialog: {
        get() { return this.show },
        set(val) { this.$emit('update:show', val) }
      },
    }
}
</script>