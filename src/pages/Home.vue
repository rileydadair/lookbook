<template>
  <div class="section">
    <SlideMaster
      className="slider--main"
      @onSliderEvent="onSliderEvent"
      @onSliderMount="onSliderMount"
      ref="slider"
    >
      <template slot="slides" v-for="item in items">
        <Slide 
          :bgMobile="item.main_image_mobile" 
          :bgDesktop="item.main_image_desktop" 
          :key="`slide-${item.id}`" 
          ref="slides"
        />
      </template>
      <span slot="prevButton" class="controls__plus">+</span>
      <span slot="nextButton" class="controls__plus">+</span>
    </SlideMaster>
    <div class="titles">
      <template v-for="item in items">
        <Title
          :titleVal="item.title"
          :key="`title-${item.id}`"
          ref="titles"
        />
      </template>
    </div>
    <Progress ref="progress" />
  </div>
</template>

<script>
import SlideMaster from '../components/SlideMaster'
import Slide from '../components/Slide'
import Title from '../components/Title'
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
      Progress
    },
    methods: {
      onSliderMount(slider) {
        slider.toggleEvents(false);

        Promise.all([
          this.$refs.slides[0].show('next'),
          setTimeout(() => this.$refs.titles[0].show(), 600)
        ])
          .then(() => slider.toggleEvents())
      },
      onSliderEvent(e, slider, currentIndex, nextIndex, direction) {
        // Progress animation
        this.$refs.progress.setCurrent(nextIndex + 1, direction);
        // Titles animation
        const titlePromise = this.$refs.titles[currentIndex].hide()
        titlePromise.then(() => this.$refs.titles[nextIndex].show())
        // Slides animation
        Promise.all([
          this.$refs.slides[currentIndex].hide(direction),
          this.$refs.slides[nextIndex].show(direction),
        ])
          .then(() => slider.toggleEvents())
      },
    }
  }
</script>