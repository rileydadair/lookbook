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
          :bgMobile="item.main_image_mobile" 
          :bgDesktop="item.main_image_desktop" 
          :key="`slide-main-${item.id}`" 
          ref="mainSlides"
        />
      </template>
      <span slot="prevButton" class="controls__plus">+</span>
      <span slot="nextButton" class="controls__plus">+</span>
    </SlideMaster>

    <div class="slider slider--section">
      <template v-for="item in items">
        <Slide 
          :bgMobile="item.detail_images[0]" 
          :bgDesktop="item.detail_images[0]" 
          :key="`slide-section-${item.id}`" 
          ref="sectionSlides"
        />
      </template>
    </div>

    <div class="title">
      <template v-for="item in items">
        <Title :titleVal="item.title" :key="`title-${item.id}`" ref="titles" />
      </template>
    </div>

    <div class="description">
      <template v-for="item in items">
        <Description :descriptionVal="item.description" :key="`description-${item.id}`" ref="descriptions" />
      </template>
    </div>

    <Progress ref="progress" />
  </div>
</template>

<script>
import States from '../core/services/States'
import SlideMaster from '../components/SlideMaster'
import Slide from '../components/Slide'
import Title from '../components/Title'
import Description from '../components/Description'
import Progress from '../components/Progress'

  export default {
    name: 'Home',
    props: {
      items: Array
    },
    components: {
      SlideMaster,
      Slide,
      Title,
      Description,
      Progress
    },
    computed: {
      swipe() {
        return States.deviceType === 'mobile' ? true : false
      }
    },
    methods: {
      onSliderMount(slider) {
        slider.toggleEvents(false);

        Promise.all([
          this.$refs.mainSlides[0].show('next'),
          this.$refs.sectionSlides[0].show('prev'),
          setTimeout(() => this.$refs.titles[0].show(), 600),
          setTimeout(() => this.$refs.descriptions[0].show('prev'), 400)
        ])
          .then(() => slider.toggleEvents())
      },
      onSliderEvent(e, slider, currentIndex, nextIndex, direction) {
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
          this.$refs.sectionSlides[currentIndex].hide(direction),
          this.$refs.mainSlides[nextIndex].show(direction),
          this.$refs.sectionSlides[nextIndex].show(direction)          
        ])
          .then(() => slider.toggleEvents())
      },
    }
  }
</script>