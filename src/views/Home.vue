<template>
  <div class="main">
      <SlideMaster
        className="slider--main"
        @onSliderEvent="onSliderEvent"
        @onSliderMount="onSliderMount"
        :swipe="swipe"
        ref="slider"
      >
        <template slot="slides" v-for="item in items">
          <Slide
            :bgImage="bgImage(item)"
            :bgPosition="bgPosition(item)"
            :key="`slide-main-${item.slug}`"
            ref="mainSlides"
          />
        </template>
        <!-- <span slot="prevButton" class="controls__item controls__item--minus">-</span>
        <span slot="nextButton" class="controls__item controls__item--plus">+</span> -->
        <span slot="prevButton" class="controls__item">+</span>
        <span slot="nextButton" class="controls__item">+</span>
      </SlideMaster>

      <div v-if="deviceType === 'desktop'" class="slider slider--section">
        <template v-for="item in items">
          <Slide
            :bgImage="item.detail_images[0].image_desktop"
            :key="`slide-section-${item.slug}`"
            ref="sectionSlides"
          />
        </template>
      </div>

      <div class="title">
        <template v-for="item in items">
          <Title :titleVal="item.title" :slug="item.slug" :key="`title-${item.slug}`" ref="titles" />
        </template>
      </div>

      <div class="description">
        <template v-for="item in items">
          <Description :descriptionVal="item.description" :key="`description-${item.slug}`" ref="descriptions" />
        </template>
      </div>

      <Progress ref="progress" />
  </div>
</template>

<script>
import States from '@/services/States'
import items from '@/data/items'
import imagesLoaded from 'imagesloaded'

import SlideMaster from '@/components/SlideMaster'
import Slide from '@/components/Slide'
import Title from '@/components/Title'
import Description from '@/components/Description'
import Progress from '@/components/Progress'

  export default {
    name: 'Home',
    props: ['transitioning', 'initialLoad'],
    components: {
      SlideMaster,
      Slide,
      Title, // eslint-disable-line
      Description,
      Progress // eslint-disable-line
    },
    data() {
      return {
        items: items,
        currentIndex: 0,
        deviceType: States.deviceType,
        next: {},
        slider: {}
      }
    },
    beforeCreate() {
      document.body.classList.add('home')
    },
    beforeRouteUpdate(to, from, next) {
      this.$root.$emit('toggleOverlay', 'show', next);
    },
    mounted() {
      if (this.transitioning) {
        this.$root.$emit('hideOverlay');
      }
      this.$root.$on('assetsLoaded', this.enter)

      function componentEnter(component) {
        component.enter();
      }

      console.log(this.initialLoad)

      if (this.initialLoad) {
        imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => componentEnter(this))
      }
    },
    destroyed() {
      document.body.classList.remove('home')
      document.body.classList.remove('enter')
    },
    computed: {
      swipe() {
        // Consider setting deviceType in Vuex store
        return this.deviceType === 'mobile' ? true : false
      }
    },
    methods: {
      enter() {
        console.log('HOme enter');
        setTimeout(() => {
          Promise.all([
            this.$refs.mainSlides[0].show('next'),
            this.deviceType === 'desktop' ? this.$refs.sectionSlides[0].show('prev') : '',
            setTimeout(() => this.$refs.titles[0].show(), 760),
            setTimeout(() => this.$refs.descriptions[0].show('prev'), 600),
            setTimeout(() => document.body.classList.add('enter'), 600)
          ])
            .then(() => {
              this.slider.toggleEvents()
            })
        }, 200)
      },
      onSliderMount(slider) {
        slider.toggleEvents(false);
        this.slider = slider;
      },

      onSliderEvent(e, slider, currentIndex, nextIndex, direction) {
        this.currentIndex = nextIndex
        // Progress animation
        this.$refs.progress.setCurrent(nextIndex + 1, direction);
        // Titles animation
        const titlePromise = this.$refs.titles[currentIndex].hide()
        titlePromise.then(() => this.$refs.titles[nextIndex].show())
        // Description animation
        const descriptionPromise = this.$refs.descriptions[currentIndex].hide(direction)
        descriptionPromise.then(() => this.$refs.descriptions[nextIndex].show(direction))
        // Slides animation
        Promise.all([
          this.$refs.mainSlides[currentIndex].hide(direction),
          this.deviceType === 'desktop' ? this.$refs.sectionSlides[currentIndex].hide(direction) : '',
          this.$refs.mainSlides[nextIndex].show(direction),
          this.deviceType === 'desktop' ? this.$refs.sectionSlides[nextIndex].show(direction) : ''      
        ])
          .then(() => slider.toggleEvents())
      },

      bgImage(item) {
        return this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop;
      },

      bgPosition(item) {
        return item.main_image_desktop.includes('vans/main') ? '50% 100%' : '';
      }
    }
  }
</script>
