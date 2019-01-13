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
    },

    showImage1() {
      TweenMax.killTweensOf(this.$refs.inner);
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
          onStart: () => {
              this.$refs.reveal.style.opacity = 1;
          }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.inner, .9, {
          ease: Expo.easeOut,
          startAt: {opacity: 0, y: '50%', rotation: -15, scale:0},
          y: '0%',
          rotation: 0,
          opacity: 1,
          scale: 1
      }), 'begin')
      .add(new TweenMax(this.$refs.img, .9, {
          ease: Expo.easeOut,
          startAt: {rotation: 15, scale: 2},
          rotation: 0,
          scale: 1
      }), 'begin')
    },

    hideImage1() {
      TweenMax.killTweensOf(this.$refs.inner);
      TweenMax.killTweensOf(this.$refs.img);

      this.tl = new TimelineMax({
          onComplete: () => {
              TweenMax.set(this.$refs.reveal, {opacity: 0});
          }
      })
      .add('begin')
      .add(new TweenMax(this.$refs.inner, 0.3, {
          ease: Sine.easeOut,
          y: '-40%',
          rotation: 10,
          scale: 0.9,
          opacity: 0
      }), 'begin')
      .add(new TweenMax(this.$refs.img, 0.3, {
          ease: Sine.easeOut,
          rotation: -10,
          scale: 1.5
      }), 'begin')
    }
  }
}
</script>