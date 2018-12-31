<template>
  <div class="scroll">
    <div class="scroll__wrap">
      <span
        v-for="(part, index) in scrollSplit"
        :key="`scroll-part-${index}`"
        class="scroll__part"
        ref="parts">{{ part }}</span>
    </div>
  </div>
</template>

<script>
import TweenMax from 'gsap'
export default {
  name: 'Scroll',
  data() {
    return {
      scrollSplit: 'Scroll'.split('')
    }
  },
  methods: {
    toggle(action, repeat) {
      TweenMax.staggerFromTo(this.$refs.parts, 1, {
        opacity: action === 'show' ? 0 : 1
      }, {
        opacity: action === 'show' ? 1 : 0,
        ease: 'Power2.easeOut',
        delay: action === 'show' ? 1 : 0,
      }, .05, repeat ? this.repeat : false)
    },

    repeat() {
      this.tl = new TimelineMax({
        repeat: -1,
        repeatDelay: 0.8,
        delay: 0.8
      })
      .add('begin')
      .add(TweenMax.staggerTo(this.$refs.parts, 0.5, {
        opacity: 0,
        ease: 'Power2.easeOut'
      }, 0.05), 'begin')
      .add(TweenMax.staggerTo(this.$refs.parts, 0.5, {
        opacity: 1,
        ease: 'Power2.easeOut'
      }, 0.05), 'begin+=0.68')
    }
  }
}
</script>