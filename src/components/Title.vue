<template>
  <router-link :to="{ name: 'detail', params: { slug: slug } }" class="title__link js-hover" :class="{ 'is-active': active }" ref="title" event="" v-on:click.native="route" :tabindex="tabIndex" :aria-label="title">
    <span class="title__wrap">
      <span class="title__part" v-for="(part, index) in splitTitle" :key="`title-part-${index}`" ref="titleParts">{{ part }}</span>
    </span>
    <span class="title__wrap title__wrap--stroke">
      <span class="title__part title__part--stroke" v-for="(part, index) in splitTitle" :key="`title-part-dup-${index}`" ref="titlePartsStroke">{{ part }}</span>
    </span>
  </router-link>
</template>

<script>
import States from '@/services/States'
import TweenMax from 'gsap'

export default {
  name: 'Title',
  props: {
    titleVal: String,
    slug: String
  },
  data() {
    return {
      active: false,
      canRoute: true,
      title: this.titleVal,
      splitTitle: this.titleVal.split('')
    }
  },
  computed: {
    tabIndex: function () {
      return this.active ? 0 : -1
    }
  },
  methods: {
    getIndexArray() {
      const indexArray = []

      this.splitTitle.forEach((letter, index) => {
        indexArray.push(index);
      })

      return indexArray
    },

    hide() {
      return this.toggle('hide')
    },

    show() {
      return this.toggle('show')
    },

    toggle(action) {
      const togglePromise = new Promise(resolve => {
        if (action === 'show') this.active = true
        
        const indexArray = this.getIndexArray()
        const duration = 0.2

        this.splitTitle.forEach((letter, index) => {
          const letterIndex = indexArray.splice(Math.floor(Math.random()*indexArray.length), 1)
          const animation = {
            opacity: action === 'hide' ? 0 : 1,
            delay: index * 0.055,
            ease: action === 'hide' ? 'Power2.easeOut' : 'Power2.easeIn',
            onComplete: function(i, arr) {
              if (i === (arr.length - 1)) {
                resolve()
              }
            },
            onCompleteParams: [index, this.splitTitle]
          }
          TweenMax.to(this.$refs.titleParts[letterIndex], duration, animation)
          TweenMax.to(this.$refs.titlePartsStroke[letterIndex], duration, animation)
        })
      })

      togglePromise.then(() => {
        if (action === 'hide') this.active = false
      })

      return togglePromise
    },
    
    route() {
      if (!this.canRoute) return

      function hideTitle(component) {
        const titlePromise = component.hide()
        titlePromise.then(() => {
          component.$router.push(`/${component.slug}`)
        })
      }

      this.$root.$emit('hideCursor')
      this.$root.$emit('toggleSliderEvents', false);
      this.$root.$emit('toggleOverlay', 'show', () => hideTitle(this));

      this.canRoute = false
    }
  }
}
</script>
