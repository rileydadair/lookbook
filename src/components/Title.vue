<template>
  <a href="" class="title" :class="[`title--${title}`,{ 'is-active': active}]" ref="title" v-on:click="route" :tabindex="tabIndex" :aria-label="title">
    <span class="title__wrap">
      <span class="title__part" v-for="(part, index) in splitTitle" :key="`title-part-${index}`" ref="titleParts">{{ part }}</span>
    </span>
    <span class="title__wrap title__wrap--stroke">
      <span class="title__part title__part--stroke" v-for="(part, index) in splitTitle" :key="`title-part-dup-${index}`" ref="titlePartsStroke">{{ part }}</span>
    </span>
  </a>
</template>

<script>
import TweenMax from 'gsap';

export default {
  name: 'Title',
  props: {
    titleVal: String
  },
  data() {
    return {
      active: false,
      animation: {
        duration: 0.6
      },
      canRoute: true,
      title: this.titleVal,
      splitTitle: this.titleVal.split('')
    }
  },
  computed: {
    classObject: function () {
      return {
        
      }
    },
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
        const duration = action === 'hide' ? 0.15 : 0.25

        this.splitTitle.forEach((letter, index) => {
          const letterIndex = indexArray.splice(Math.floor(Math.random()*indexArray.length), 1);

          TweenMax.to(this.$refs.titleParts[letterIndex], duration, {
            opacity: action === 'hide' ? 0 : 1,
            delay: index * 0.045,
            onComplete: function(i, arr) {
              if (i === (arr.length - 1)) {
                resolve()
              }
            },
            onCompleteParams: [index, this.splitTitle]
          })
          TweenMax.to(this.$refs.titlePartsStroke[letterIndex], duration, {
            opacity: action === 'hide' ? 0 : 1,
            delay: index * 0.045,
            onComplete: function(i, arr) {
              if (i === (arr.length - 1)) {
                resolve()
              }
            },
            onCompleteParams: [index, this.splitTitle]
          })
        })
      })

      togglePromise.then(() => {
        if (action === 'hide') this.active = false
      })

      return togglePromise
    },
    route(e) {
      e.preventDefault()
      console.dir(e.currentTarget)
    }
  }
}
</script>
