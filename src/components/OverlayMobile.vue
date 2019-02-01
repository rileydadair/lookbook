<template>
    <div class="overlay-m" ref="overlay"></div>
  </template>
  
  <script>
  import TweenMax from 'gsap'
  import CustomEase from '@/services/CustomEase'
  
  export default {
    name: 'OverlayMobile',
    props: {
      active: Boolean
    },
    data() {
      return {
        animation: {
          duration: 0.8,
          ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
        }
      }
    },
    mounted() {
      if (this.active) this.show()
      this.$root.$on('hideOverlay', this.hide)
      this.$root.$on('showOverlay', this.show)
      this.$root.$on('toggleOverlay', this.toggle)
      TweenMax.set(this.$refs.overlay, { transformStyle: 'preserve-3d' })
    },
    methods: {
      hide() {
        TweenMax.set(this.$refs.overlay, { scaleY: 0 })
      },
      
      show() {
        TweenMax.set(this.$refs.overlay, { scaleY: 1 })
      },
  
      toggle(action, next, callback) {
        TweenMax.to(this.$refs.overlay, this.animation.duration, {
          ease: this.animation.ease,
          transformOrigin: action === 'show' ? "0% 100%" : "50% 0%",
          scaleY: action === 'show' ? 1 : 0,
          onComplete: () => {
            if (next) next()
            if (callback) callback()
          }
        })
      }
    }
  }
  </script>