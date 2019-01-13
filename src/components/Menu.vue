<template>
  <div class="menu" ref="menu">
    <div class="menu__wrap" ref="wrap">
      <nav class="nav" ref="nav">
        <div class="nav__item" v-for="(item, index) in itemsList" :key="`menu-list-${index}`" ref="items">
          <NavLink @showHoverImg="showHoverImg" @hideHoverImg="hideHoverImg" :item="item" :index="index" v-on:click.native="route(item.slug, index)" ref="links" />
        </div>
      </nav>
      <div class="hover-imgs" ref="imgs">
        <HoverReveal v-for="(item, index) in itemsList" :class="`hover-reveal--${index + 1}`" :key="`hover-img-${index}`" :img="item.main_image_desktop" ref="img" />
      </div>
      <About :deviceType="deviceType" ref="about" />
      <div class="about-cover"></div>
    </div>
  </div>
</template>

<script>
import States from '@/services/States'
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

import HoverReveal from './HoverReveal'
import NavLink from './NavLink'
import About from './About'

export default {
  name: 'Menu',
  props: {
    items: Array,
    menuActive: Boolean
  },
  components: {
    HoverReveal,
    NavLink,
    About
  },
  data() {
    return {
      animation: {
        duration: this.deviceType === 'desktop' ? 0.95 : 0.85,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      },
      deviceType: States.deviceType,
      headerBtn: {},
      itemsList: this.items,
    }
  },
  mounted() {
    this.$root.$on('toggleMenu', this.toggleMenu);
    this.headerBtn = document.querySelector('.header__btn')
  },
  methods: {
    showHoverImg(index) {
      if (this.menuActive) this.$refs.img[index].showImage()
    },

    hideHoverImg(index) {
      if (this.menuActive) this.$refs.img[index].hideImage()
    },

    route(slug, index) { // eslint-disable-line
      if (this.$refs.links[index].$el.classList.contains('router-link-exact-active')) {
        this.toggleMenu('hide').then(() => this.hide())
        this.$refs.img.forEach(img => img.leaveImage())
      } 

      else if (this.$route.name === 'detail') {
        this.leaveNav()
        this.$router.push(`/${slug}`)
      }
      
      else {
        this.leaveNav()
        this.$root.$emit('hideCursor')
        this.$root.$emit('toggleOverlay', 'show', () => this.$router.push(`/${slug}`))
      }

      this.$emit('toggleMenuState')
    },

    hide() {
      TweenMax.set(this.$refs.menu, {
        y: '-100%',
        opacity: 0
      })
      document.body.classList.remove('menu-active')
      this.removeMousemove()
      this.$refs.img.forEach(img => img.hideImage())
    },

    initMousemove() {
      window.addEventListener('mousemove', this.onMousemove)
    },

    removeMousemove() {
      window.removeEventListener('mousemove', this.onMousemove)
    },

    positionElement(e) {
      let { clientX: x, clientY: y } = e
      const xSpeed = 50
      const ySpeed = 150
      const elRect = this.$refs.imgs.getBoundingClientRect()
      const elWidth = elRect.width
      const elHeight = elRect.height

      const { offsetWidth: width, offsetHeight: height } = this.$refs.menu
      const xWalk = Math.round((x / width * xSpeed) - (xSpeed / 2))
      const yWalk = Math.round((y / height * ySpeed) - (ySpeed / 2) - (elHeight * .5))

      TweenMax.to(this.$refs.imgs, 2, {
        x: xWalk,
        y: yWalk,
        ease: Expo.easeOut
      })
    },

    onMousemove(e) {
      requestAnimationFrame(() => this.positionElement(e))
    },

    leaveNav() {
      TweenMax.to(this.$refs.items, 0.3, { ease: 'Power1.easeIn' , opacity: 0, y: '-130%' })
      this.$refs.img.forEach(img => img.leaveImage())
    },

    toggleNav(action) {
      if (action === 'show') {
        this.$refs.nav.style.display = 'block'
        this.$refs.imgs.style.display = 'block'

        TweenMax.set(this.$refs.items, {opacity: 0, y: '100%'})
        
        setTimeout(() => {
          TweenMax.staggerTo(this.$refs.items, 0.5, { ease: 'Sine.easeIn', opacity: 1 }, .085)
          TweenMax.staggerTo(this.$refs.items, 0.7, { ease: 'Power2.easeOut', y: '0%' }, .085)
        }, this.deviceType === 'desktop' ? 550 : 450)

        if (this.deviceType === 'desktop') this.initMousemove()
      }
      
      else {
        this.removeMousemove()
        TweenMax.to(this.$refs.items, 0.3, {
          ease: 'Power1.easeIn',
          opacity: 0, 
          y: '-130%',
          onComplete: () => {
            this.$refs.nav.style.display = 'none'
            this.$refs.imgs.style.display = 'none'
          }
        })
      }
    },

    toggleMenu(action, about) {
      return new Promise(resolve => {
        if (about) {
          this.$refs.about.toggle(action)
          document.body.classList.toggle('about-active')
        } else {
          this.toggleNav(action)
        }
        this.$root.$emit('toggleHeaderBtns', action, about)
        if (action === 'show') document.body.classList.add('menu-active')

        // Menu animation
        TweenMax.to(this.$refs.menu, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: '-100%', opacity: 1 },
          y: action === 'hide' ? '-100%' : '0%',
        })
        TweenMax.to(this.$refs.wrap, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: '100%' },
          y: action === 'hide' ? '100%' : '0%',
          onComplete(hide) {
            if (action === 'hide') hide()
            resolve()
          },
          onCompleteParams: [this.hide]
        })
      })
    }
  }
}
</script>
