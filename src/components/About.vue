<template>
  <div class="about" ref="about">
    <div class="about__wrap" ref="wrap">
      <h1 class="about__header">Just Look At It</h1>
      <div class="about__body">
        <p class="about__text about__text--main">Lookbook is a side project - exploring new interactions and animations. Inspired by prototypes on <a href="https://dribbble.com/" class="about__link">dribbble.com</a></p>
        <ul class="about__list">
          <li class="about__list-item"><span class="thin">Nike SB Lookbook by </span><a href="https://dribbble.com/shots/4884140-Nike-SB-Lookbook" target="_blank" class="about__link">Craig Gittins</a></li>
          <li class="about__list-item"><span class="thin">Max Colt VFX by </span><a href="https://dribbble.com/shots/5449199-Maxcolt-VFX-Producer" target="_blank" class="about__link">Advanced Group</a></li>
          <li class="about__list-item"><span class="thin">Various works of </span><a href="https://dribbble.com/nathanriley" target="_blank" class="about__link">Nathan Riley</a></li>
          <li class="about__list-item"><span class="thin">Various works of </span><a href="https://dribbble.com/Zhenya_Artem" target="_blank" class="about__link">Zhenya Rynzhuk</a></li>
          <li class="about__list-item"><span class="thin">Various works of </span><a href="https://dribbble.com/crnacura" target="_blank" class="about__link">Mary Lou</a></li>
        </ul>
        <p class="about__text"><span class="thin">Images from </span><a href="https://unsplash.com/" target="_blank" class="about__link">unsplash.com</a></p>
        <p class="about__text"><span class="thin">Have a design and need someone to bring it to life? <br/>Hit me up </span><a href="mailto:hello@rileyadair.com" class="about__link">hello@rileyadair.com</a><span class="about__peace">✌</span></p>
      </div>
    </div>
    <h1 class="about__header about__header--full">Just<br/>Look<br />At<br/> It</h1>
  </div>
</template>

<script>
import TweenMax from 'gsap'
import Smooth from '@/services/scroll/Smooth'

export default {
  name: 'About',
  props: {
    deviceType: String
  },
  data() {
    return {
      smoothInit: false
    }
  },
  mounted() {
    this.initSmooth()
  },
  destroyed() {
    if (this.smoothInit) this.smooth.destroy()
  },
  methods: {
    initSmooth() {
      this.smooth = new Smooth({
        preload: false,
        native: false,
        noscrollbar: true,
        section: document.querySelector('.about__wrap'),
        vs : { mouseMultiplier: 0.4 },
      })
    },

    toggle(action) {
      if (action === 'show') {
        this.$refs.about.style.display = 'block'

        TweenMax.to(this.$refs.about, 0.4, {
          opacity: action === 'show' ? 1 : 0,
          delay: .55,
          onComplete(about) {
            if (!about.smoothInit) {
              about.smooth.init();
              about.smoothInit = true
            } else {
              about.smooth.on()
            }
          },
          onCompleteParams: [this]
        })
      }

      else {
        TweenMax.to(this.$refs.about, 0.4, {
          opacity: action === 'show' ? 1 : 0,
          onComplete: (about) => {
            this.$refs.about.style.display = 'none'
            about.smooth.off()
            about.smooth.vars.current = 0
            about.smooth.vars.last = 0
            about.smooth.vars.target = 0
            this.$refs.wrap.style.transform = 'translate3d(0px, 0px, 0px)'
          },
          onCompleteParams: [this]
        })
      }
    }
  }
}
</script>