<template>
  <div class="menu" ref="menu">
    <div class="menu__wrap" ref="wrap">
      <div v-if="deviceType === 'desktop'" class="slider slider--section">
        <template v-for="item in items">
          <div class="slider__wrap">
            <Slide
              :bgImage="item.detail_images[0].image_desktop"
              className="slide--menu"
              :key="`slide-section-${item.slug}`"
              ref="sectionSlides"
            />
          </div>
        </template>
      </div>
      <nav class="nav">
        <div class="nav__item" v-for="(item, index) in itemsList" :key="`menu-list-${index}`">
          <router-link :to="{ name: 'detail', params: { slug: item.slug } }" class="nav__link" :class="[activeIndex === index ? 'is-active' : '']" event="" v-on:click.native="route(item.slug, index)" ref="links">
            <div class="nav__title-wrap">
              <span class="nav__title">{{ item.title }}</span>
              <span class="nav__title nav__title--stroke">{{ item.title }}</span>
            </div>
            <span class="nav__num">00{{ index + 1 }}</span>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import States from '@/services/States'
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

import Slide from './Slide'

export default {
  name: 'Menu',
  props: {
    items: Array,
    menuActive: Boolean
  },
  components: {
    Slide
  },
  data() {
    return {
      activeIndex: 0,
      deviceType: States.deviceType,
      itemsList: this.items,
      animation: {
        duration: 1,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  mounted() {
    this.$root.$on('toggleMenu', this.toggle);
  },
  methods: {
    route(slug, index) { // eslint-disable-line
      if (this.$refs.links[index].$el.classList.contains('router-link-exact-active')) {
        this.toggle('hide').then(() => this.hide())
      } 

      if (this.$route.name === 'detail') {
        this.$router.push(`/${slug}`)
      }
      
      else {
        this.$root.$emit('toggleOverlay', 'show', () => this.$router.push(`/${slug}`));
      }

      this.$emit('toggleMenuState')
    },

    hide() {
      TweenMax.set(this.$refs.menu, {
        y: '-100%',
        opacity: 0
      })
      document.body.classList.remove('menu-active')
    },

    toggle(action) {
      return new Promise(resolve => {
        if (action === 'show') document.body.classList.add('menu-active')

        TweenMax.to(this.$refs.menu, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: '-100%', opacity: 1 },
          y: action === 'hide' ? '-100%' : '0%',
        })
        TweenMax.to(this.$refs.wrap, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: '100%' },
          y: action === 'hide' ? '100%' : '0%',
          onComplete() {
            if (action === 'hide') document.body.classList.remove('menu-active')
            resolve()
          }
        })
      })
    }
  }
}
</script>
