<template>
  <BrandMobile v-if="deviceType !== 'desktop'"
    :item="item"
    :nextTitle="nextTitle"
    :nextSlug="nextSlug" />
  <Brand v-else :item="item" />
</template>

<script>
import States from '@/services/States'
import items from '@/data/items'

import Brand from '@/components/Brand'
import BrandMobile from '@/components/BrandMobile'

export default {
  name: 'Detail',
  components: {
    Brand,
    BrandMobile
  },
  data() {
    return {
      deviceType: States.deviceType,
      item: {},
      nextTitle: '',
      nextSlug: ''
    }
  },
  beforeRouteUpdate(to, from, next) {
    // Can run page transition between brands
    console.dir(to)
    console.dir(from)
    next()
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
      // else - set data to render 404 page
    })
    document.body.classList.remove('is-loading')
  }
}
</script>