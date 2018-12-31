<template>
  <div class="main">
    <div class="brand">
      <template v-for="(image, index) in item.detail_images">

        <template v-if="index === 1">
          <div class="brand-wrap" :key="`brand-wrap-${index}`" ref="brandWraps">
            <Reveal :bgImage="bgImage(item.detail_images[1])" ref="reveal" @onPhotoClick="onPhotoClick" />
            <Reveal :bgImage="bgImage(item.detail_images[2])" ref="reveal" @onPhotoClick="onPhotoClick" />
          </div>
        </template>
        <template v-else-if="index === 2"></template>
        <template v-else>
          <div class="brand-wrap" :key="`brand-wrap-${index}`" ref="brandWraps">
            <Reveal :bgImage="bgImage(image)" ref="reveal" @onPhotoClick="onPhotoClick" />
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
    <Scroll v-if="!scrolledDetail" ref="scroll"/>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import TweenMax from 'gsap'
import Custom from '@/services/scroll/Custom'
import Smooth from '@/services/scroll/Smooth'

import BrandLink from './BrandLink'
import Reveal from './Reveal'
import Scroll from '@/components/Scroll'

export default {
  name: 'Brand',
  props: {
    initialLoad: Boolean,
    item: Object,
    nextTitle: String,
    nextSlug: String,
    scrolledDetail: Boolean
  },
  components: {
    BrandLink,
    Reveal,
    Scroll
  },
  data() {
    return {
      current: 0,
      hasScrolled: false
    }
  },
  watch: {
    hasScrolled: function() {
      if (!this.scrolledDetail) {
          this.$refs.scroll.toggle('hide', false)
          setTimeout(() => this.$emit('disableScrollEl', 'scrolledDetail'), 800)
      }
    }
  },
  mounted() {
    setTimeout(() => {
      function componentInit(component) { component.init() }
      if (this.initialLoad) {
        imagesLoaded(document.querySelectorAll('.brand-img'), {background: true}, () => componentInit(this))
      }
    })
  },
  destroyed() {
    this.smooth.destroy();
  },
  methods: {
    init() {
      setTimeout(() => this.$root.$emit('toggleOverlay', 'hide'), 100)
      setTimeout(() => this.revealImages(), 1000)
      setTimeout(() => {
        document.body.classList.add('enter')
        this.$root.$emit('cursorEnter')
        this.$refs.scroll.toggle('show', true)
      }, 1600)
    },

    revealImages() {
      this.$refs.reveal.forEach(el => {
        el.show()
      })

      setTimeout(() => {
        this.initSmooth()
        this.revealTitle()
      }, 1000)
    },

    revealTitle() {
      TweenMax.to(this.$refs.brandTitleWrap, 2.2, {
        ease: 'Expo.easeOut',
        startAt: {y: '100%'},
        y: '0%',
        onStart: () => {
          this.$refs.brandTitleWrap.style.opacity = 0.18
        }
      })
    },

    scaleImages(vars) {
      const current = Math.round(vars.current)
      const scale = Math.abs(current - this.current) / 260 + 1 < 1.14 ? Math.abs(current - this.current) / 260 + 1 : 1.14
      const skew = (current - this.current) * 0.25

      this.$refs.reveal.forEach(ref => {
          TweenMax.to(ref.$el, 1.4, {
          scaleX: scale,
          ease: 'Power2.easeOut'
        })
      })
      TweenMax.to(this.$refs.brandTitleWrap, 1.4, {
        skewX: skew,
        force3D: true,
        skewType: 'simple',
        ease: 'Power2.easeOut'
      })

      this.current = current

      if (!this.hasScrolled) this.hasScrolled = true
    },

    initSmooth() {
      this.smooth = new Custom({
        callback: this.scaleImages.bind(this),
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

    onPhotoClick(e) {
      // console.dir(e.currentTarget.parentNode)
      // // const reveal = e.currentTarget.parentNode
      // const elRect = e.currentTarget.getBoundingClientRect()
      // const elCenterX = (window.innerWidth / 2) - elRect.x - (elRect.width / 2)

      // TweenMax.to(e.currentTarget, .6, {
      //   x: `${elCenterX}px`,
      //   // y: `${elCenterY}px`
      // })
    },

    bgImage(image) {
      return `url('${image.image_desktop}')`
    },
  }
}
</script>
