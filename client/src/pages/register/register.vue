<template>
<div>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
</div>
</template>

<style src="@/assets/stylesheets/util/transitions.css"></style>
<style src="@/App.css"></style>