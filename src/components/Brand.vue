<template>
  <div class="main">
    <div class="brand">
      <template v-for="(image, index) in item.detail_images">

        <template v-if="index === 1">
          <div class="brand-wrap" ref="brandWraps">
            <Reveal :bgImage="bgImage(item.detail_images[1])" :key="`reveal-${index}`" ref="reveal" />
            <Reveal :bgImage="bgImage(item.detail_images[2])" :key="`reveal-${index + 1}`" ref="reveal" />
          </div>
        </template>
        <template v-else-if="index === 2"></template>
        <template v-else>
          <div class="brand-wrap" ref="brandWraps">
            <Reveal :bgImage="bgImage(image)" :key="`reveal-${index}`" ref="reveal" />
          </div>
        </template>
      </template>
      <div class="brand-wrap">
        <!-- v-if for router error when the template is trying to access the data that does not (yet) exist -->
        <template v-if="nextSlug">
          <BrandLink :nextTitle="nextTitle" :nextSlug="nextSlug" />
        </template>
      </div>
    </div>
    <div class="brand__title" ref="brandTitle">
      <span class="brand__title-wrap" ref="brandTitleWrap">
        {{ item.title }}
      </span>
    </div>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import TweenMax from 'gsap'
import Custom from '@/services/scroll/Custom'
import Smooth from '@/services/scroll/Smooth'

import Reveal from './Reveal'
import BrandLink from './BrandLink'

export default {
  name: 'Brand',
  props: {
    item: Object,
    nextTitle: String,
    nextSlug: String
  },
  components: {
    Reveal,
    BrandLink
  },
  data() {
    return {
      animation: {
        duration: 2.2,
        ease: 'Expo.easeOut'
      }
    }
  },
  mounted() {
    setTimeout(() => {
      function componentInit(component) { component.init() }
      imagesLoaded(document.querySelectorAll('.brand-img'), {background: true}, () => componentInit(this))
    })
  },
  destroyed() {
    this.smooth.destroy();
  },
  methods: {
    init() {
      setTimeout(() => {
        this.$root.$emit('toggleOverlay', 'hide');
      }, 200)

      setTimeout(() => {
        this.revealImages();
      }, 1000)
    },

    revealImages() {
      this.$refs.reveal.forEach(el => {
        el.show()
      })

      setTimeout(() => {
        this.initSmooth()
        this.revealTitle()
      }, 1160)
    },

    revealTitle() {
      // return new Promise(resolve => {
        TweenMax.to(this.$refs.brandTitleWrap, this.animation.duration, {
          ease: this.animation.ease,
          startAt: {y: '100%'},
          y: '0%',
          onStart: () => {
            this.$refs.brandTitleWrap.style.opacity = 0.15
          },
          onComplete: () => {
            // resolve()
          }
        })
      // })
    },

    initSmooth() {
      this.smooth = new Custom({
        preload: false,
        native: false,
        noscrollbar: true,
        direction: 'horizontal',
        section: document.querySelector('.brand'),
        divs: document.querySelectorAll('.brand-wrap'),
        vs : { mouseMultiplier: 0.4 },
        title: this.$refs.brandTitle,
        addTitle: this.addTitle
      });

      this.smooth.init();
    },

    addTitle() {
      return new Promise(resolve => {
        const htmlArr = Array.from(this.$refs.brandTitle.children[0].innerHTML.split(' '))
        htmlArr.push(this.item.title)

        const longerHTML = htmlArr.join(' ')
        this.$refs.brandTitle.children[0].innerHTML = longerHTML

        setTimeout(() => resolve(), 0)
      })
    },

    bgImage(image) {
      return `url('${image.image_desktop}')`
    },
  }
}
</script>
