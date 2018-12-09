<template>
  <div :class="className" ref="reveal">
    <div :class="`${className}__inner`" ref="inner">
      <div :class="`${className}__img`" class="brand-img" :style="{ backgroundImage: bgImage }" ref="img"></div>
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
        duration: 1.6,
        mobileDuration: 1.2,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  computed: {
    className() {
      return States.deviceType === 'mobile' ? 'reveal-m' : 'reveal'
    }
  },
  methods: {
    showMobile() {
      TweenMax.to(this.$refs.inner, this.animation.mobileDuration, {
        ease: this.animation.ease,
        startAt: { y: '-100%' },
        y: '0%'
      })

      TweenMax.to(this.$refs.img, this.animation.mobileDuration, {
        ease: this.animation.ease,
        startAt: { y: '100%'},
        y: '0%',
        onStart: () => {
          this.$refs.img.style.transformOrigin = '50% 0%'
          this.$refs.reveal.style.opacity = 1
        },
      })
    },

    show() {
      this.tl = new TimelineMax({
        onStart: () => {
          // this.$refs.reveal.style.opacity = 1;
          TweenMax.to(this.$refs.reveal, this.animation.duration, {
            ease: this.animation.ease,
            opacity: 1
          });
        }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.inner, this.animation.duration, {
        transformStyle: 'preserve-3d',
        ease: this.animation.ease,
        startAt: {scaleY:0},
        scaleY: 1
      }), 'begin')
      .add(new TweenMax(this.$refs.img, this.animation.duration, {
        transformStyle: 'preserve-3d',
        ease: this.animation.ease,
        startAt: {scaleY: 2},
        scaleY: 1
      }), 'begin');
    }
  }
}
</script>