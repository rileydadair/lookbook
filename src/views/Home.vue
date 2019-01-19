<template>
  <div class="main">
    <svg class="hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.3 10.6">
      <symbol id="chevron">
        <polyline points="0.7 9.9 9.1 1.4 17.6 9.9" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"/>
      </symbol>
    </svg>
    <SlideMaster
      className="slider--main"
      :swipe="swipe"
      @onSliderEvent="onSliderEvent"
      @onSliderMount="onSliderMount"
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
      <span slot="prevButton" class="controls__item js-hover" data-lock="controls" data-lock-prev>
        <span class="controls__text controls__text--prev js-controls-text">
          <span class="controls__part js-controls-part" v-for="(part, index) in prevSplit" :key="`prev-part-${index}`" ref="prevParts">{{ part }}</span>
        </span>
        <svg class="controls__arrow controls__arrow--prev"><use xlink:href="#chevron"></use></svg>
      </span>
      <span slot="nextButton" class="controls__item js-hover" data-lock="controls">
        <span class="controls__text controls__text--next js-controls-text">
          <span class="controls__part js-controls-part" v-for="(part, index) in nextSplit" :key="`next-part-${index}`" ref="nextParts">{{ part }}</span>
        </span>
        <svg class="controls__arrow controls__arrow--next"><use xlink:href="#chevron"></use></svg>
      </span>
    </SlideMaster>

    <div v-if="deviceType !== 'mobile'" class="slider slider--section">
      <template v-for="item in items">
        <Slide
          :bgImage="item.detail_images[0].image_desktop"
          :key="`slide-section-${item.slug}`"
          ref="sectionSlides"
        />
      </template>
    </div>

    <div class="titles">
      <template v-for="(item, index) in items">
        <div class="title__index" @click="handleTitleClick(index)">
          <Title :titleVal="item.title" :titleIndex="titleIndex" :index="index" :slug="item.slug" :key="`title-${item.slug}`" ref="titles" />
        </div>
      </template>
    </div>

    <div class="description">
      <template v-for="item in items">
        <Description :descriptionVal="item.description" :key="`description-${item.slug}`" ref="descriptions" />
      </template>
    </div>

    <Progress ref="progress" />

    <Scroll v-if="!scrolledHome" ref="scroll"/>
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
import Scroll from '@/components/Scroll'

  export default {
    name: 'Home',
    props: ['initialLoad', 'transitioning', 'menuActive', 'scrolledHome'],
    components: {
      SlideMaster,
      Slide,
      Title, // eslint-disable-line
      Description,
      Progress, // eslint-disable-line
      Scroll
    },
    data() {
      return {
        items: items,
        currentIndex: 0,
        deviceType: States.deviceType,
        next: {},
        nextSplit: 'Next'.split(''),
        prevSplit: 'Prev'.split(''),
        previousIndex: 0,
        slider: {},
        titleIndex: -1
      }
    },
    watch: {
      menuActive: function(boolean) {
        // Toggle slider events on menuActive change
        this.slider.toggleEvents(!boolean)
      }
    },
    beforeCreate() {
      document.body.classList.add('home')
    },
    beforeRouteLeave(to, from, next) {
      if (this.menuActive) {
        next()
        return
      }

      this.$refs.mainSlides[this.previousIndex].kill()
      this.$refs.mainSlides[this.currentIndex].kill()
      if (this.deviceType === 'desktop') {
        this.$refs.sectionSlides[this.previousIndex].kill()
        this.$refs.sectionSlides[this.currentIndex].kill()
      }

      setTimeout(() => {
        function handleTitle(component) {
          if (component.titleIndex > -1) {
            const titlePromise = component.$refs.titles[component.titleIndex].hide()
            titlePromise.then(() => next())
          } else {
            next()
          }
        }
        this.slider.toggleEvents(false)
        this.$root.$emit('hideCursor')
        this.$root.$emit('toggleOverlay', 'show', () => handleTitle(this))
      }, 0)
    },
    mounted() {
      if (this.deviceType === 'desktop') this.$emit('resetCursor')

      if (this.transitioning) {
        this.$root.$emit('hideOverlay');
      }

      this.$root.$on('assetsLoaded', this.enter)
      this.$root.$on('toggleSliderEvents', this.toggleSliderEvents)

      function componentEnter(component) { component.enter() }

      if (this.initialLoad) {
        imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => componentEnter(this))
      }
    },
    destroyed() {
      document.body.classList.remove('home')
    },
    computed: {
      swipe() {
        return this.deviceType !== 'desktop' ? true : false
      }
    },
    methods: {
      enter() {
        const delay = 600
        setTimeout(() => {
          Promise.all([
            this.$refs.mainSlides[0].show('next'),
            this.deviceType === 'desktop' ? this.$refs.sectionSlides[0].show('prev') : '',
            setTimeout(() => this.$refs.titles[0].show(), 760),
            setTimeout(() => this.$refs.descriptions[0].show('prev'), delay),
            setTimeout(() => document.body.classList.add('enter'), delay),
            setTimeout(() => this.$root.$emit('cursorEnter'), delay),
          ])
            .then(() => {
              this.slider.toggleEvents()
            })

          if (!this.scrolledHome) {
            setTimeout(() => {
              this.$refs.scroll.toggle('show', this.deviceType === 'desktop' ? true : false)
            }, delay)
          }
        }, 200)
      },

      toggleSliderEvents(boolean) {
        // Toggle slider events - false on Title route click
        this.slider.toggleEvents(boolean)
      },

      onSliderMount(slider) {
        slider.toggleEvents(false);
        this.slider = slider;
      },

      onSliderEvent(e, slider, currentIndex, nextIndex, direction) {
        this.previousIndex = currentIndex
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

        if (!this.scrolledHome && e.type === 'wheel' || !this.scrolledHome && e.type.includes('swipe')) {
          this.$refs.scroll.toggle('hide', false)
          setTimeout(() => this.$emit('disableScrollEl', 'scrolledHome'), 800)
        }
      },

      bgImage(item) {
        return this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop;
      },

      bgPosition(item) {
        return item.main_image_desktop.includes('vans/main') ? '50% 100%' : '';
      },

      handleTitleClick(index) {
        this.titleIndex = index
      }
    }
  }
</script>
