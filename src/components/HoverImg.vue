<template>
  <div class="hover-reveal" ref="reveal">
    <div class="hover-reveal__inner" ref="inner">
      <div class="hover-reveal__img" :style="{ backgroundImage: `url( ${img} )` }" ref="img"></div>
    </div>
  </div>
</template>

<script>
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'HoverImg',
  props: {
    img: String
  },
  data() {
    return {
      animation: {
        duration: 0.65,
        ease: CustomEase.create("custom", "M0,0 C0.134,0.12 0.21,0.197 0.256,0.282 0.31,0.382 0.356,0.552 0.386,0.632 0.429,0.747 0.461,0.816 0.564,0.912 0.652,0.994 0.806,1 1,1"),
        // ease: Power2.easeOut,
        opacity: 1
      }
    }
  },
  methods: {
    showImage() {
      TweenMax.killTweensOf(this.$refs.inner);
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
        onStart: () => {
          this.$refs.reveal.style.transformOrigin = '50% 0%'
          this.$refs.reveal.style.opacity = this.animation.opacity;
        }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.inner, this.animation.duration, {
          ease: this.animation.ease,
          startAt: {y: '-100%'},
          y: '0%'
      }), 'begin')
      .add(new TweenMax(this.$refs.img, this.animation.duration, {
          ease: this.animation.ease,
          startAt: {y: '100%'},
          y: '0%'
      }), 'begin')
      .add(new TweenMax(this.$refs.img, 1.6, {
          ease: Expo.easeOut,
          startAt: {scale: 1.3},
          scale: 1
      }), 'begin')
    },

    hideImage() {
      TweenMax.killTweensOf(this.$refs.inner);
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
        onComplete: () => {
          TweenMax.set(this.$refs.reveal, {opacity: 0});
        }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.inner, this.animation.duration, {
          ease: this.animation.ease,
          y: '100%'
      }), 'begin')
      
      .add(new TweenMax(this.$refs.img, this.animation.duration, {
          ease: this.animation.ease,
          y: '-100%'
      }), 'begin')
    }
  }
}
</script>