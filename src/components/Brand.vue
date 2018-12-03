<template>
  <div class="main">
    <div class="vs-section">
      <template v-for="(image, index) in item.detail_images">

        <template v-if="index === 1">
          <div class="vs-wrap">
            <Reveal :bgImage="bgImage(item.detail_images[1])" :key="`reveal-${index}`" ref="reveal" />
            <Reveal :bgImage="bgImage(item.detail_images[2])" :key="`reveal-${index + 1}`" ref="reveal" />
          </div>
        </template>
        <template v-else-if="index === 2"></template>
        <template v-else>
            <div class="vs-wrap">
              <Reveal :bgImage="bgImage(image)" :key="`reveal-${index}`" ref="reveal" />
            </div>
        </template>
      </template>

      <div class="test"></div>
    </div>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'
import Custom from '@/services/scroll/Custom'
import Smooth from '@/services/scroll/Smooth'

import Reveal from './Reveal'

export default {
  name: 'Brand',
  props: {
    item: Object,
    nextTitle: String,
    nextSlug: String
  },
  components: {
    Reveal
  },
  mounted() {
    setTimeout(() => {
      function componentInit(component) { component.init() }
      imagesLoaded(document.querySelectorAll('.detail-img'), {background: true}, () => componentInit(this))
    })
  },
  destroyed() {
    this.smooth.destroy();
  },
  methods: {
    init() {
      setTimeout(() => {
        this.$root.$emit('toggleOverlay', 'hide');
        
        this.smooth = new Custom({
          preload: false,
          native: false,
          noscrollbar: true,
          direction: 'horizontal',
          section: document.querySelector('.vs-section'),
          divs: document.querySelectorAll('.vs-wrap'),
          vs : { mouseMultiplier: 0.4 },
          test: document.querySelector('.test')
        });

        this.smooth.init();
        this.initReveal();
      }, 200)
    },

    initReveal() {
      setTimeout(() => {
        this.$refs.reveal.forEach(el => {
          el.show()
        })
      }, 450)
      // no overlay glitch at 460 - intermittent
    },

    bgImage(image) {
      return `url('${image.image_desktop}')`
    },
  }
}
</script>
