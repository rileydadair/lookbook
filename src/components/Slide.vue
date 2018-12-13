<template>
  <div class="slide" :class="[{ 'is-active': active }, className]" ref="slide">
    <div class="slide__wrap" ref="wrap">
      <div class="slide__img" :style="{ backgroundImage: `url( ${bgImage} )`, backgroundPosition: bgPosition }" ref="img"></div>
    </div>
  </div>
</template>

<script>
import States from '@/services/States'
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'Slide',
  props: {
    bgImage: String,
    bgPosition: {
      type: String
    },
    className: String
  },
  data() {
    return {
      active: false,
      animation: {
        duration: 1.2,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  methods: {
    hide(direction) {
      return this.toggle('hide', direction)
    },

    show(direction) {
      setTimeout(() => this.$refs.slide.style.zIndex = 100)

      return this.toggle('show', direction)
    },

    toggle(action, direction) {
      return new Promise(resolve => {
        if (action === 'show') {
          TweenMax.to(this.$refs.wrap, this.animation.duration, {
            ease: this.animation.ease,
            startAt: { y: direction === 'next' ? '100%' : '-100%' },
            y: '0%'
          })
        }

        TweenMax.to(this.$refs.img, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: direction === 'next' ? '-100%' : '100%'},
          y: '0%',
          onStart: () => {
            this.$refs.img.style.transformOrigin = action === 'hide' ?
              direction === 'next' ? '50% 100%' : '50% 0%' :
              direction === 'next' ? '50% 0%' : '50% 100%'
            this.$refs.slide.style.opacity = 1
          },
          onComplete: () => {
            this.$refs.slide.style.zIndex = 99
            this.$refs.slide.style.opacity = action === 'hide' ? 0 : 1
          }
        })

        TweenMax.to(this.$refs.img, (this.animation.duration + .3), {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : {scale: 1.1 },
          scale: action === 'hide' ? 1.1 : 1,
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
