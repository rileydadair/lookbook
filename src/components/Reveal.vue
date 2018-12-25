<template>
  <div :class="className" ref="reveal">
    <div :class="`${className}__inner`" ref="inner">
      <div :class="`${className}__img`" class="brand-img" :style="{ backgroundImage: bgImage }" ref="img"></div>
      <div :class="`${className}__overlay ${className}__overlay--top`" ref="overlayTop"></div>
      <div :class="`${className}__overlay ${className}__overlay--bottom`" ref="overlayBottom"></div>
    </div>
  </div>
</template>

<script>
import States from '@/services/States'
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'Reveal',
  props: {
    bgImage: String,
  },
  data() {
    return {
      animation: {
        duration: 1.4,
        mobileDuration: 1.2,
        ease: CustomEase.create("custom", "M0,0 C0.204,0.04 0.266,0.101 0.314,0.214 0.358,0.318 0.358,0.34 0.396,0.48 0.428,0.6 0.432,0.71 0.522,0.816 0.6,0.908 0.704,1 1,1"),
        mobileEase: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  computed: {
    className() {
      return States.deviceType !== 'desktop' ? 'reveal-m' : 'reveal'
    }
  },
  methods: {
    showMobile() {
      TweenMax.to(this.$refs.inner, this.animation.mobileDuration, {
        ease: this.animation.mobileEase,
        startAt: { y: '-100%' },
        y: '0%'
      })
      TweenMax.to(this.$refs.img, this.animation.mobileDuration, {
        ease: this.animation.mobileEase,
        startAt: { y: '100%'},
        y: '0%',
        onStart: () => {
          this.$refs.img.style.transformOrigin = '50% 0%'
          this.$refs.reveal.style.opacity = 1
        },
      })
    },

    show() {
      TweenMax.to(this.$refs.overlayTop, this.animation.duration, {
        ease: this.animation.ease,
        transformOrigin: "0% 0%",
        scaleY: 0,
      })
      TweenMax.to(this.$refs.overlayBottom, this.animation.duration, {
        ease: this.animation.ease,
        transformOrigin: "0% 100%",
        scaleY: 0,
      })
      TweenMax.to(this.$refs.img, (this.animation.duration + .3), {
        ease: this.animation.ease,
        startAt: {scale: 1.1 },
        scale: 1,
      })
    }
  }
}
</script>