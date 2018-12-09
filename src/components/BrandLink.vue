<template>
  <div class="brand__cta">
    <router-link :to="{ name: 'detail', params: { slug: nextSlug } }" class="link" ref="link">
      <span class="link__wrap link__wrap--title">
        <span class="link__part link__part--title" v-for="(part, index) in splitTitle" :key="`part-title-${index}`" ref="titleParts">{{ part }}</span>
      </span>
      <span class="link__wrap link__wrap--next">
        <span class="link__part link__part--next" v-for="(part, index) in splitNext" :key="`part-next-${index}`" ref="nextParts">{{ part }}</span>
      </span>
    </router-link>
    <p class="brand__text" :class="{ 'is-active': active}">
      <span class="brand__next" ref="nextText">Next </span><span class="brand__lookbook">lookbook</span>
    </p>
  </div>
</template>

<script>
import TweenMax from 'gsap'

export default {
  name: 'BrandLink',
  props: {
    nextTitle: String,
    nextSlug: String
  },
  data() {
    return {
      active: false,
      splitNext: 'next'.split(''),
      splitTitle: this.nextTitle.split('')
    }
  },

  mounted() {
    this.$refs.link.$el.addEventListener('mouseenter', this.enter)
    this.$refs.link.$el.addEventListener('mouseleave', this.leave)
  },

  beforeDestroy() {
    this.$refs.link.$el.removeEventListener('mouseenter', this.enter)
    this.$refs.link.$el.removeEventListener('mouseleave', this.leave)
  },

  methods: {
    getIndexArray(array) {
      const indexArray = []

      array.forEach((letter, index) => {
        indexArray.push(index);
      })

      return indexArray
    },

    enter() {
      setTimeout(() => {
        const togglePromise = this.toggleLink(this.$refs.nextParts, 'hide')
        togglePromise.then(() => {
          this.active = true;
          this.toggleLink(this.$refs.titleParts, 'show')
        })
      }, 200)
      console.log('leave');
    },
    
    leave() {
      setTimeout(() => {
        const togglePromise = this.toggleLink(this.$refs.titleParts, 'hide')
        togglePromise.then(() => {
          this.active = false;
          this.toggleLink(this.$refs.nextParts, 'show')
        })
      }, 200)
    },

    toggleText() {

    },

    toggleLink(array, action, killArray) {
      return new Promise(resolve => {
        // if (this.tween.isActive()) this.tween.kill();

        const indexArray = this.getIndexArray(array)

        array.forEach((letter, index) => {
          const letterIndex = indexArray.splice(Math.floor(Math.random()*indexArray.length), 1)

          this.tween = TweenMax.to(array[letterIndex[0]], 0.2, {
            opacity: action === 'hide' ? 0 : 1,
            delay: index * 0.06,
            onComplete: function(i, arr) {
              if (i === (arr.length - 1)) {
                resolve()
                console.log('resolve')
              }
            },
            onCompleteParams: [index, array]
          })
        })
      })
    }
  }
}
</script>