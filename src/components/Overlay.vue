<template>
  <div class="overlay" ref="overlay"></div>
</template>

<script>
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'Overlay',
  data() {
    return {
      animation: {
        duration: 1,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  mounted() {
    this.$root.$on('toggleOverlay', this.toggle)
    this.$root.$on('hideOverlay', this.hide)
    TweenMax.set(this.$refs.overlay, { transformStyle: 'preserve-3d' })
  },
  methods: {
    hide() {
      TweenMax.set(this.$refs.overlay, { scaleY: 0 })
      // this.$refs.overlay.style.opacity = '0'
    },
    toggle(action, next) {
      // if (action === 'show') {
      //   this.$refs.overlay.style.opacity = '1'
      //   // TweenMax.set(this.$refs.overlay, { transform })
      // }

      // TweenMax.to(this.$refs.overlay, this.animation.duration, {
      //   ease: this.animation.ease,
      //   startAt: { y: action === 'show' ? '100%' : '0%' },
      //   y: action === 'show' ? '0%' : '-100%',
      //   onComplete: () => {
      //     if (next) next()
      //     if (action === 'hide') {
      //       this.$refs.overlay.style.opacity = '0'
      //     }
      //   }
      // })
      TweenMax.to(this.$refs.overlay, this.animation.duration, {
        ease: this.animation.ease,
        transformOrigin: action === 'show' ? "0% 100%" : "50% 0%",
        scaleY: action === 'show' ? 1 : 0,
        onComplete: () => {
          if (next) next()
          // if (action === 'hide') {
          //   this.$refs.overlay.style.opacity = '0'
          // }
        }
      })
    }
  }
}
</script>