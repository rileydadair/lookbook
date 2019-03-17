<template>
  <div class="gallery-slide" :class="[{ 'is-active': active}, aspectClass]" ref="slide">
    <div class="gallery-slide__wrap" ref="wrap">
      <div class="gallery-slide__img" :style="{ backgroundImage: `url( ${bgImage} )` }" ref="img"></div>
    </div>
  </div>
</template>

<script>
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'GallerySlide',
  props: {
    bgImage: String,
    portrait: Number,
    className: String
  },
  data() {
    return {
      active: false,
      animation: {
        duration: .9,
        hideDuration: .7,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  mounted() {
    
  },
  computed: {
    aspectClass() {
      if (typeof this.portrait === 'undefined') {
        return null
      } else {
        return this.portrait ? 'gallery-slide--portrait' : 'gallery-slide--landscape'
      }
    }
  },
  methods: {
    init() {
      TweenMax.set(this.$refs.slide, { opacity: 1 })
    },

    reset() {
      TweenMax.set(this.$refs.slide, { opacity: 0 })
      TweenMax.set(this.$refs.wrap, { x: '0%' })
      TweenMax.set(this.$refs.img, { x: '0%', scale: 1 })
    },

    hide(direction, faster, still) {
      return this.toggle('hide', direction, faster, still)
    },

    show(direction, faster, still) {
      setTimeout(() => this.$refs.slide.style.zIndex = 100)

      return this.toggle('show', direction, faster, still)
    },

    toggle(action, direction, faster, still) {
      return new Promise(resolve => {
        if (action === 'show') {
          TweenMax.to(this.$refs.wrap, faster ? this.animation.hideDuration : this.animation.duration, {
            ease: this.animation.ease,
            startAt: { x: direction === 'next' ? '-100%' : '100%' },
            x: '0%'
          })
        } else if (action === 'hide' && !still) {
          TweenMax.to(this.$refs.wrap, faster ? this.animation.hideDuration : this.animation.duration, {
            ease: this.animation.ease,
            x: direction === 'next' ? '100%' : '-100%'
          })
        }

        const tween = {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { x: direction === 'next' ? '100%' : '-100%'},
          onStart: () => {
            this.$refs.img.style.transformOrigin = action === 'hide' ?
              direction === 'next' ? '100% 50%' : '0% 50%' :
              direction === 'next' ? '0% 50%' : '100% 50%'
            this.$refs.slide.style.opacity = 1
          },
          onComplete: () => {
            this.$refs.slide.style.zIndex = 99
            this.$refs.slide.style.opacity = action === 'hide' ? 0 : 1
          }
        }

        if (!still) {
          tween['x'] = action === 'hide' ? direction === 'next' ? '-100%' : '100%' : '0%'
        } else {
          tween['x'] = '0%'
        }

        TweenMax.to(this.$refs.img, faster ? this.animation.hideDuration : this.animation.duration, tween)

        TweenMax.to(this.$refs.img, (faster ? this.animation.hideDuration : this.animation.duration + .3), {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : {scale: 1.15 },
          scale: action === 'hide' ? 1.15 : 1,
          onComplete: () => {
            this.active = action === 'hide' ? false : true
            resolve()
          }
        })
      })
    }
  }
}
</script>