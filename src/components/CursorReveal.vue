<template>
  <div class="cursor-reveal" ref="reveal">
    <div class="cursor-reveal__inner" ref="inner">
      <div class="cursor-reveal__img"
        :style="{ backgroundImage: `url( ${img} )` }"
        ref="img">
      </div>
    </div>
  </div>
</template>

<script>
import { TweenMax, TimelineMax } from 'gsap'

export default {
  name: 'CursorReveal',
  props: {
    img: String
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
      .add(new TweenMax(this.$refs.inner, 0.4, {
        ease: 'Power2.easeOut',
        startAt: {x: '-100%'},
        x: '0%'
      }), 'begin')
      .add(new TweenMax(this.$refs.img, 0.4, {
        ease: 'Power2.easeOut',
        startAt: {x: '100%'},
        x: '0%'
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
        ease: 'Power1.easeOut',
        x: '100%'
      }), 'begin')
      
      .add(new TweenMax(this.$refs.img, 0.3, {
        ease: 'Power1.easeOut',
        x: '-100%'
      }), 'begin');
    }
  }
}
</script>