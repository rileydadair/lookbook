<template>
  <div :class="getClassName" ref="reveal">
    <div :class="`${getClassName}__inner`" ref="inner">
      <div :class="`${getClassName}__img`" :style="{ backgroundImage: `url( ${img} )` }" ref="img"></div>
    </div>
  </div>
</template>

<script>
import { TweenMax, TimelineMax } from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'HoverReveal',
  props: {
    img: String,
    className: String
  },
  data() {
    return {
      animation: {
        duration: 0.65,
        ease: CustomEase.create("custom", "M0,0 C0.134,0.12 0.21,0.197 0.256,0.282 0.31,0.382 0.356,0.552 0.386,0.632 0.429,0.747 0.461,0.816 0.564,0.912 0.652,0.994 0.806,1 1,1"),
        opacity: 1
      }
    }
  },
  computed: {
    getClassName() {
      return this.className ? this.className : 'hover-reveal'
    }
  },
  methods: {
    showImage() {
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
        onStart: () => {
          this.$refs.reveal.style.zIndex = 1;
        }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.img, .2, {
          ease: 'Sine.easeOut',
          opacity: 1,
      }), 'begin')
      .add(new TweenMax(this.$refs.img, 1.8, {
          ease: 'Power2.easeOut',
          startAt: {scale: 1.3},
          scale: 1
      }), 'begin')
    },

    hideImage() {
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
        onStart: () => {
          this.$refs.reveal.style.zIndex = 0;
        }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.img, .2, {
          ease: 'Sine.easeOut',
          opacity: 0,
      }), 'begin')
    },

    leaveImage() {
      TweenMax.killTweensOf(this.$refs.img);
      TweenMax.to(this.$refs.img, 0.6, {ease: 'Power2.easeOut', opacity: 0})
    }
  }
}
</script>