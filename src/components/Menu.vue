<template>
  <div class="menu" ref="menu">
    <div class="menu__wrap" ref="wrap">
      <!-- <div class="hover-imgs">
        <HoverImg v-for="(item, index) in itemsList" :key="`hover-img-${index}`" :img="item.main_image_desktop" />
      </div> -->
      <nav class="nav" ref="nav">
        <div class="nav__item" v-for="(item, index) in itemsList" :key="`menu-list-${index}`" ref="items">
          <NavLink @showHoverImg="showHoverImg" @hideHoverImg="hideHoverImg" :item="item" :index="index" v-on:click.native="route(item.slug, index)" ref="links" />
        </div>
      </nav>
      <div class="hover-imgs" ref="imgs">
        <HoverImg v-for="(item, index) in itemsList" :class="`hover-reveal--${index + 1}`" :key="`hover-img-${index}`" :img="item.main_image_desktop" ref="img" />
      </div>
    </div>
  </div>
</template>

<script>
import States from '@/services/States'
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

import HoverImg from './HoverImg'
import NavLink from './NavLink'

export default {
  name: 'Menu',
  props: {
    items: Array,
    menuActive: Boolean
  },
  components: {
    HoverImg,
    NavLink
  },
  data() {
    return {
      animation: {
        duration: this.deviceType === 'desktop' ? 0.95 : 0.85,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      },
      deviceType: States.deviceType,
      itemsList: this.items,
    }
  },
  mounted() {
    this.$root.$on('toggleMenu', this.toggleMenu);
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
        this.$refs.img.forEach(img => img.hideImage())
      } 

      if (this.$route.name === 'detail') {
        this.$router.push(`/${slug}`)
      }
      
      else {
        this.$root.$emit('toggleOverlay', 'show', () => this.$router.push(`/${slug}`));
      }

      this.$emit('toggleMenuState')
    },

    // Find all menu hide methods and rename - hideMenu
    hide() {
      TweenMax.set(this.$refs.menu, {
        y: '-100%',
        opacity: 0
      })
      document.body.classList.remove('menu-active')
      this.removeMouseMove()
      this.$refs.img.forEach(img => img.hideImage())
    },

    initMouseMove() {
      document.addEventListener('mousemove', this.mouseMove)
    },

    removeMouseMove() {
      document.removeEventListener('mousemove', this.mouseMove)
    },

    positionElement(ev) {
      let { clientX: x, clientY: y } = ev
      const xSpeed = 60
      const ySpeed = 150
      const elRect = this.$refs.imgs.getBoundingClientRect()
      const elHeight = elRect.height
      // const elBottom = elRect.top + elRect.height
      // const guard = (elHeight * 0.25) + elBottom

      // if (y > guard) y = guard

      const { offsetWidth: width, offsetHeight: height } = this.$refs.menu
      const xWalk = Math.round((x / width * xSpeed) - (xSpeed / 2))
      const yWalk = Math.round((y / height * ySpeed) - (ySpeed / 2) - (elHeight * .5))

      TweenMax.to(this.$refs.imgs, 2, {
        // x: xWalk,
        y: yWalk,
        ease: Expo.easeOut
      })
    },

    mouseMove(ev) {
      requestAnimationFrame(() => {
        this.positionElement(ev)
      })
    },

    hideNav() {
      TweenMax.to(this.$refs.nav, 0.4, { ease: Expo.easeOut, y: 0 })
      TweenMax.to(this.$refs.items, 0.3, { ease: Sine.easeIn, opacity: 0 })
    },

    toggleNav(action) {
      if (action === 'show') {
        this.tl = new TimelineMax({
          onStart: () => {
            this.$refs.items.forEach(el => {
              TweenMax.set(el, {opacity: 0, yPercent: -60})
            })
          }
        })
        this.tl.add('begin')
        if (this.deviceType === 'desktop') {
          this.initMouseMove()
          const elHeight = this.$refs.nav.getBoundingClientRect().height * 0.225
          const windowHeight = window.innerHeight / 2
          const tweenY = windowHeight - elHeight


          this.tl.add(new TweenMax(this.$refs.nav, 0, {
            ease: Expo.easeOut,
            // y: tweenY
            yPercent: -50
          }), 'begin')
        }
        this.tl.add(TweenMax.staggerTo(this.$refs.items, 0.65, { ease: Sine.easeIn, opacity: 1 }, 0.09), this.deviceType === 'desktop' ? 'begin+=0.53' : 'begin+=0.45')
        this.tl.add(TweenMax.staggerTo(this.$refs.items, 0.65, { ease: Expo.easeOut, yPercent: 0 }, 0.09), this.deviceType === 'desktop' ? 'begin+=0.53' : 'begin+=0.45')
      }
      
      else {
        this.removeMouseMove()
        this.tl = new TimelineMax()
        if (this.deviceType === 'desktop') {
          this.tl.add(new TweenMax(this.$refs.nav, 0.6, {
            ease: Expo.easeOut,
            yPercent: -100
          }), 'begin')
          this.tl.add(TweenMax.to(this.$refs.items, 0.3, { ease: Sine.easeIn , opacity: 0 }), 'begin')
        }
      }
    },

    toggleMenu(action) {
      return new Promise(resolve => {
        this.toggleNav(action)
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
