<template>
  <div class="main" ref="main">
    <Gallery
      ref="gallery"
      :item="item"
      @resetClickedPhoto="resetClickedPhoto"
      @onGalleryReset="onGalleryReset" />
    <div class="brand">
      <template v-for="(image, index) in item.detail_images">

        <template v-if="index === 1">
          <div class="brand-wrap" :key="`brand-wrap-${index}`" ref="brandWraps">
            <Reveal :bgImage="bgImage(item.detail_images[1])" :isPortrait="item.detail_images[1].portrait" :isClickable="isClickable" :index="1" ref="reveal" @onPhotoClick="onPhotoClick" />
            <Reveal :bgImage="bgImage(item.detail_images[2])" :isPortrait="item.detail_images[2].portrait" :isClickable="isClickable" :index="2" ref="reveal" @onPhotoClick="onPhotoClick" />
          </div>
        </template>
        <template v-else-if="index === 2"></template>
        <template v-else>
          <div class="brand-wrap" :key="`brand-wrap-${index}`" ref="brandWraps">
            <Reveal :bgImage="bgImage(image)" :isPortrait="image.portrait" :isClickable="isClickable" :index="index" ref="reveal" @onPhotoClick="onPhotoClick" />
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
import CustomEase from '@/services/CustomEase'
import Custom from '@/services/scroll/Custom'
import Smooth from '@/services/scroll/Smooth'

import BrandLink from './BrandLink'
import Reveal from './Reveal'
import Scroll from '@/components/Scroll'
import Gallery from '@/components/Gallery'

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
    Scroll,
    Gallery
  },
  data() {
    return {
      activeGallery: false,
      isClickable: true,
      clickedIndex: -1,
      current: 0,
      cursor: {},
      hasScrolled: false,
      photoEase: CustomEase.create("custom", "M0,0 C0.29,0 0.321,0.105 0.348,0.166 0.378,0.234 0.42,0.348 0.464,0.49 0.484,0.58 0.544,0.776 0.634,0.882 0.712,0.974 0.784,1 1,1"),
      revealInners: []
    }
  },
  watch: {
    hasScrolled: function() {
      if (!this.scrolledDetail) {
        this.$refs.scroll.toggle('hide', false)
        setTimeout(() => this.$emit('disableScrollEl', 'scrolledDetail'), 800)
      }
    },
    isClickable: function(boolean) {
      console.log(boolean)
      this.cursor.dataset.clickable = boolean
      // if (!boolean) this.cursor.dataset.reveal = false
    }
  },
  mounted() {
    setTimeout(() => {
      function componentInit(component) { component.init() }
      if (this.initialLoad) {
        imagesLoaded(document.querySelectorAll('.brand-img'), {background: true}, () => componentInit(this))
      }
      this.revealInners = document.querySelectorAll('.reveal__inner')
      this.cursor = document.querySelector('.cursor')
      this.cursor.dataset.clickable = true
    })
  },
  destroyed() {
    this.smooth.destroy();
    document.body.classList.remove('active-gallery')
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

      // console.log(Math.abs(current - this.current))

      if (Math.abs(current - this.current) > 1) {
        this.isClickable = false
      } else {
        if (!this.isClickable) {
          this.isClickable = true
        }
      }

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

    resetClickedPhoto() {
      // Refactor duplicate code
      setTimeout(() => {
        const elRect = this.revealInners[this.clickedIndex].getBoundingClientRect()
        const isPortrait = this.revealInners[this.clickedIndex].classList.contains('is-portrait')
        const portraitWidth = .38
        const landscapeWidth = .56
        const elWidth = window.innerWidth * (isPortrait ? portraitWidth : landscapeWidth)
        const elHeight= window.innerHeight * .66
        const elCenterX = (window.innerWidth / 2) - elRect.x - (elWidth / 2)
        const elCenterY = (window.innerHeight / 2) - elRect.y - (elHeight / 2)
  
        const tween = {
          onStart: () => {
            this.revealInners[this.clickedIndex].style.opacity = 0
            this.revealInners[this.clickedIndex].style.zIndex = -1
          },
          onComplete: () => {
            this.revealInners[this.clickedIndex].style = "opacity: 0"
          },
          x: `${elCenterX}px`,
          width: `${elWidth}px`,
          // zIndex: 999,
          ease: this.photoEase
        }
  
        if (isPortrait) {
          tween['y'] = '0%'
          tween['top'] = '0%'
          tween['height'] = '100vh'
        } else {
          tween['y'] = `${elCenterY}px`
          tween['height'] = '66vh'
        }
  
        TweenMax.to(this.revealInners[this.clickedIndex], .8, tween)
      })
    },

    onPhotoClick(e, index) {
      this.smooth.off()
      this.revealInners[index].style = ""

      // Set flag of can click current scroll is less than certain amount

      const elRect = e.currentTarget.getBoundingClientRect()
      const isPortrait = e.currentTarget.classList.contains('is-portrait')
      const portraitWidth = .38
      const landscapeWidth = .56
      const elWidth = window.innerWidth * (isPortrait ? portraitWidth : landscapeWidth)
      const elHeight= window.innerHeight * .66
      const elCenterX = (window.innerWidth / 2) - elRect.x - (elWidth / 2)
      const elCenterY = (window.innerHeight / 2) - elRect.y - (elHeight / 2)

      this.revealInners.forEach((el, i) => {
        if (i !== index) TweenMax.to(el, .4, { opacity: 0 })
      })

      const tween = {
        onStart: () => {
          this.revealInners[index].style.zIndex = 999
        },
        x: `${elCenterX}px`,
        width: `${elWidth}px`,
        ease: this.photoEase
      }

      if (isPortrait) {
        tween['y'] = '0%'
        tween['top'] = '0%'
        tween['height'] = '100vh'
      } else {
        tween['y'] = `${elCenterY}px`
        tween['height'] = '66vh'
      }

      TweenMax.to(e.currentTarget, .8, tween)

      this.$refs.gallery.init(index)
      this.clickedIndex = index
      document.body.classList.add('active-gallery')
    },

    bgImage(image) {
      return `url('${image.image_desktop}')`
    },

    onGalleryReset() {
      document.body.classList.remove('active-gallery')
      TweenMax.to(this.revealInners, 0.4, { opacity: 1 })
      this.smooth.on()
    }
  }
}
</script>
