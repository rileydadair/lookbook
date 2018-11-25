<template>
  <BrandMobile v-if="this.$parent._data.deviceType !== 'desktop'"
    :item="item"
    :nextTitle="nextTitle"
    :nextSlug="nextSlug" />
  <Brand v-else :item="item" />
</template>

<script>
import items from '../data/items'
import Brand from '../components/Brand'
import BrandMobile from '../components/BrandMobile'

export default {
  name: 'Detail',
  components: {
    Brand,
    BrandMobile
  },
  data() {
    return {
      item: {},
      nextTitle: '',
      nextSlug: ''
    }
  },
  beforeCreate() {
    document.body.classList.add('detail')
  },
  updated() {
    document.body.classList.add('detail')
  },
  destroyed() {
    document.body.classList.remove('detail')
  },
  mounted() {
    // Get item object
    items.forEach((item, index, array) => {
      if (item.slug === this.$route.params.slug) {
        this.item = item

        let nextIndex = index + 1
        if (nextIndex === array.length) nextIndex = 0

        this.nextTitle = array[nextIndex].title
        this.nextSlug = array[nextIndex].slug
        return
      }
    })
    document.body.classList.remove('is-loading')
  }
}
</script>