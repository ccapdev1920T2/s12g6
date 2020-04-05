<template>
<transition>
  <div id="drawing"
    class="absolute z-30 h-screen w-screen flex items-center justify-center"
    :style="classBG">
  </div>
</transition>
</template>
<script>
import { SVG } from '@svgdotjs/svg.js'

export default {
  props: {
    bg: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classBG() {
      return {
        'background-color': this.bg ? 'white' : 'none'
      }
    },
  },

  methods: {
    heartbeat() {
      let draw = SVG().addTo('#drawing').size(300, 300)
      let grad = draw.gradient('linear', (add) => {
        add.stop(0, '#E83A63')
        add.stop(1, '#FF809D')
      })

      draw
      .path(`M254.626 34.4789C224.443 8.7574 179.555 13.384 151.85 41.9695L141 53.1504L130.15 41.9695C102.5 13.384 57.5566 8.7574 27.3737 34.4789C-7.21531 64.0008 -9.03289 116.986 21.921 148.986L128.497 259.032C135.382 266.137 146.563 266.137 153.448 259.032L260.024 148.986C291.033 116.986 289.215 64.0008 254.626 34.4789V34.4789Z`)
      .fill(grad)
      .scale(0.2)
      .animate(400)
      .scale(1.15)
      .ease('<>')
      .loop(true, true)
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.heartbeat()
    })
  }
}
</script>