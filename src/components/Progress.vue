<template>
  <div class="progress">
    <div class="progress__wrap">
      <span class="progress__label">00</span>
      <span class="progress__label progress__label--current" ref="currentEl">{{ this.current }}</span>
    </div>
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
      TweenMax.to(this.$refs.currentEl, 0.6, {
        ease: 'Power3.easeIn',
        y: direction === 'next' ? '-100%' : '100%',
        onComplete: () => {
          this.current = val;
          TweenMax.to(this.$refs.currentEl, 0.8, {
            ease: 'Power3.easeOut',
            startAt: {y: direction === 'next' ? '50%' : '-50%'},
            y: '0%',
          });    
        }
      });
    }
  }
}
</script>