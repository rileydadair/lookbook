<template>
  <div class="progress">
    <span class="progress__label">00</span>
    <span class="progress__label progress__label--current" ref="currentEl">{{ this.current }}</span>
  </div>
</template>

<script>
import TweenMax from 'gsap';

export default {
  name: 'Progress',
  props: {
    currentVal: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      current: this.currentVal
    }
  },
  methods: {
    setCurrent(val ,direction) {
      TweenMax.to(this.$refs.currentEl, 0.5, {
        ease: 'Expo.easeIn',
        y: direction === 'next' ? '-100%' : '100%',
        onComplete: () => {
          this.current = val;
          TweenMax.to(this.$refs.currentEl, 0.7, {
            ease: 'Expo.easeOut',
            startAt: {y: direction === 'next' ? '50%' : '-50%'},
            y: '0%',
          });    
        }
      });
    }
  }
}
</script>