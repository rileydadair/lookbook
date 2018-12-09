<template>
  <div class="overlay" ref="overlay"></div>
</template>

<script>
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'Overlay',
  props: {
    active: Boolean
  },
  data() {
    return {
      animation: {
        duration: 1,
        // Need to call CustomEase only once - other is in slide - necessitates store
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  mounted() {
    if (this.active) this.show()
    this.$root.$on('hideOverlay', this.hide)
    this.$root.$on('showOverlay', this.show)
    this.$root.$on('toggleOverlay', this.toggle)
  },
  methods: {
    hide() {
      TweenMax.set(this.$refs.overlay, { transform: 'translate3d(0, 100%, 0)' })
    },
    
    show() {
      TweenMax.set(this.$refs.overlay, { transform: 'translate3d(0, 0, 0)' })
    },

    toggle(action, next) {
      TweenMax.to(this.$refs.overlay, this.animation.duration, {
        ease: this.animation.ease,
        startAt: { transform: action === 'show' ? 'translate3d(0, 100%, 0)' : 'translate3d(0, 0, 0)' },
        transform: action === 'show' ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
        onStart: () => {
          this.$refs.overlay.style.transformOrigin = '50% 0%'
          this.$refs.overlay.style.opacity = 1
          this.$refs.overlay.style.zIndex = 200
        },
        onComplete: () => {
          if (next) next()
          if (action === 'hide') {
            this.$refs.overlay.style.opacity = 0
            this.$refs.overlay.style.zIndex = 0
          }
        }
      })
    }
  }
}
</script>