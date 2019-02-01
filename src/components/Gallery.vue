<template>
  <div class="gallery" ref="gallery">
    <SlideMaster
      className="slider--gallery"
      :swipe="false"
      @onSliderEvent="onSliderEvent"
      @onSliderMount="onSliderMount"
      ref="slider"
    >
      <template slot="slides" v-for="(item, index) in item.detail_images">
        <GallerySlide
          :portrait="item.portrait"
          :bgImage="item.image_desktop"
          :key="`slide-gallery-${index}`"
          ref="gallerySlides"
        />
      </template>

      <span slot="prevButton" class="controls__arrow-section controls__arrow-section--prev" data-arrow="prev"></span>
      <span slot="nextButton" class="controls__arrow-section controls__arrow-section--next" data-arrow="next"></span>
    </SlideMaster>
    <div class="gallery__support" ref="support">
      <template v-for="(item, index) in item.detail_images">
        <GallerySlide
          className="gallery-slide--support"
          :portrait="item.portrait"
          :bgImage="item.image_desktop"
          :key="`slide-gallery-${index}`"
          ref="supportSlides"
        />
      </template>
    </div>
    <div class="gallery__titles">
      <GalleryTitle v-for="(item, index) in item.detail_images"
        :key="`gallery-title-${index}`"
        :title="item.title"
        ref="galleryTitles"
      />
    </div>
    <div class="gallery__brand" ref="brand">{{ item.title }}</div>
    <div class="back-btn" ref="back">
      <span class="back-btn__bar"></span><button class="back-btn__text js-hover" data-lock="back" v-on:click="onBackClick">Back</button>
    </div>
  </div>
</template>

<script>
import TweenMax from 'gsap'

import SlideMaster from '@/components/SlideMaster'
import GallerySlide from '@/components/GallerySlide'
import GalleryTitle from '@/components/GalleryTitle'

export default {
  name: 'Gallery',
  props: {
    item: Object
  },
  components: {
    SlideMaster,
    GallerySlide,
    GalleryTitle,
  },
  data() {
    return {
      currentIndex: 0,
      slider: {}
    }
  },
  methods: {
    init(index) {
      this.currentIndex = index

      TweenMax.to(this.$refs.gallery, 0.4, {
        onStart: () => {
          this.$refs.gallery.style.opacity = 0
          this.$refs.gallery.style.zIndex = 1000
        },
        opacity: 1,
        onComplete: () => {
          // Get support ready
          this.$refs.support.style.opacity = 1
          // Show support slide
          this.$refs.supportSlides[index].show('next')
          // Show brand and back btn
          TweenMax.to(this.$refs.brand, .8, { opacity: 1, ease: 'Sine.easeIn'})
          TweenMax.to(this.$refs.back, .8, { opacity: 1, ease: 'Sine.easeIn'})

          setTimeout(() => {
            // Show gallery photo
            this.$refs.gallerySlides[index].init()
            // Reset brand photo
            this.$emit('resetClickedPhoto')
            // Show title
            this.$refs.galleryTitles[index].show()

            this.slider.setCurrentSlide(null, index, null)
            this.slider.toggleEvents()
          }, 400)
        }
      })

      window.addEventListener('keydown', this.onKeydown)
    },

    onKeydown(e) {
      if (e.keyCode === 27) this.onBackClick(e)
    },

    onBackClick() {
      document.body.classList.remove('active-arrows')
      this.slider.toggleEvents(false)
      // Hide brand and back btn
      TweenMax.to(this.$refs.brand, .6, { opacity: 0, ease: 'Sine.easeIn'})
      TweenMax.to(this.$refs.back, .8, { opacity: 0, ease: 'Sine.easeIn'})

      // Hide slides
      Promise.all([
        this.$refs.gallerySlides[this.currentIndex].hide('prev', true)
          // Reset Gallery
          .then(() => this.$refs.gallery.style = ""),
        this.$refs.supportSlides[this.currentIndex].hide('prev', true),
        this.$refs.galleryTitles[this.currentIndex].hide()
      ])
        .then(() => {
          this.$emit('onGalleryReset')
          this.$refs.gallerySlides.forEach(el => el.reset())
          this.$refs.supportSlides.forEach(el => el.reset())
          this.$refs.galleryTitles.forEach(el => el.reset())
        })
      
      window.removeEventListener('keydown', this.onKeydown)
    },

    onSliderMount(slider) {
      slider.toggleEvents(false)
      this.slider = slider
    },

    onSliderEvent(e, slider, currentIndex, nextIndex, direction) {
      if (e === null) return

      this.currentIndex = nextIndex
      

      Promise.all([
        this.$refs.galleryTitles[currentIndex].hide(),
        this.$refs.gallerySlides[currentIndex].hide(direction, true).then(() => {
          this.$refs.galleryTitles[nextIndex].show()
          this.$refs.gallerySlides[nextIndex].show(direction)
          this.$refs.supportSlides[currentIndex].hide(direction, false, true)
          this.$refs.supportSlides[nextIndex].show(direction)
        })
      ])
        .then(() => slider.toggleEvents())
    }
  }
}
</script>