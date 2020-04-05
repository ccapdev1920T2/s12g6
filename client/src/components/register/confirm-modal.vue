<template>
<transition name="modal-fade">
  <div class="modal-backdrop">
    <div id="modal" class="modal shadow-lg">
      <header class="modal-header">
        <slot name="header">
          <h1 class="text-xl font-normal">Confirmation Email</h1>
          <button type="button" class="btn-close" @click="close">
            <img src="@/assets/images/y.svg" alt="">
          </button>
        </slot>
      </header>

      <section class="modal-body">
        <slot name="body">
          <p>Please check the link sent to your email:</p> 
          <p>{{ email }}</p>
          <br>
          <!-- Make a Timer -->
          <button class="flex justify-center text-link" @click="resend">Resend link</button>
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
</style>

<script>
export default {
  props: [ 'email' ],
  name: 'Modal',
  methods: {
    resend() {
      this.$emit('resend')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>