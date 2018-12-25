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
        duration: 0.6,
        // ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
        ease: Power1.easeOut,
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
          // TweenMax.set(this.$refs.reveal, {zIndex: 1000});
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
        onStart: () => {
          // TweenMax.set(this.$refs.reveal, {zIndex: 999});
        },
        onComplete: () => {
          // TweenMax.set(this.$refs.reveal, {zIndex: ''});
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