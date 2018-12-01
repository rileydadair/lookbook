<template>
  <div class="loader">
    <span class="loader__value" ref="loader">{{ progress }}</span>
  </div>
</template>

<script>
import TweenMax from 'gsap'

export default {
  name: 'ProgressLoader',
  props: {
    progress: Number
  },
  methods: {
    hide() {
      return new Promise((resolve) => {
        TweenMax.to(this.$refs.loader, .7, {
          ease: 'Power3.easeOut',
          y: '-100%',
          onComplete: () => {
            resolve()
          }
        })
      })
    }
  },
}
</script>