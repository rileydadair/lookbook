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
      TweenMax.killTweensOf(this.$refs.inner);
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
          onStart: () => {
              this.$refs.reveal.style.opacity = 1;
          }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.inner, .8, {
          ease: 'Power3.easeOut',
          startAt: {opacity: 0, y: '50%', rotation: -15, scale:0},
          y: '0%',
          rotation: 0,
          opacity: 1,
          scale: 1
      }), 'begin')
      .add(new TweenMax(this.$refs.img, .8, {
          ease: 'Power3.easeOut',
          startAt: {rotation: 15, scale: 2},
          rotation: 0,
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
      .add(new TweenMax(this.$refs.inner, 0.3, {
          ease: 'Sine.easeOut',
          y: '-40%',
          rotation: 10,
          scale: 0.9,
          opacity: 0
      }), 'begin')
      .add(new TweenMax(this.$refs.img, 0.3, {
          ease: 'Sine.easeOut',
          rotation: -10,
          scale: 1.5
      }), 'begin')
    },

    leaveImage() {
      TweenMax.killTweensOf(this.$refs.inner);
      TweenMax.killTweensOf(this.$refs.img);

      TweenMax.to(this.$refs.reveal, 0.6, {ease: 'Power2.easeOut', opacity: 0})
    }
  }
}
</script>