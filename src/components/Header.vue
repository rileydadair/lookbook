<template>
  <header class="header">
    <div class="header__item header__item--title" v-on:click="handleHomeClick">
      <router-link to="/" class="header__link js-hover" data-lock="home">Lookbook</router-link>
    </div>
    <!-- <span v-if="$route.name !== 'detail'" class="header__item header__item--about">
      <router-link to="/about" class="header__link">About</router-link>
    </span> -->
    <div class="header__item header__item--all">
      <button class="header__btn js-hover" data-lock="all" v-on:click="toggleMenu" ref="btn">
        <span class="header__btn-text header__btn-text--close">
          <span class="header__part header__part--close" v-for="(part, index) in closeSplit" :key="`close-part-${index}`" ref="closeParts">{{ part }}</span>
        </span>
        <span class="header__btn-text header__btn-text--all">
          <span class="header__part header__part--all" v-for="(part, index) in allSplit" :key="`all-part-${index}`" ref="allParts">{{ part }}</span>
        </span>
      </button>
    </div>
  </header>
</template>
<script>

export default {
  name: 'Header',
  props: {
    menuActive: Boolean
  },
  data() {
    return {
      closeSplit: 'Close'.split(''),
      allSplit: 'All'.split('')
    }
  },
  mounted() {
    this.$root.$on('toggleAll', this.toggleAll)
  },

  methods: {
    handleHomeClick() {
      if (this.$route.name === 'home' && this.menuActive) {
        this.$root.$emit('toggleMenu', 'hide')
        this.$emit('toggleMenuState')
      } else {

      }
    },

    toggleMenu() {
      if (!this.menuActive) {
        this.$root.$emit('toggleMenu', 'show')
      } else {
        this.$root.$emit('toggleMenu', 'hide')
      }

      this.$emit('toggleMenuState')

      this.$refs.btn.classList.toggle('is-active')
    },

    resetAll() {
      TweenMax.set(this.$refs.allParts, { opacity: 1 })
      TweenMax.set(this.$refs.closeParts, { opacity: 0 })
    },

    toggleAll(action) {
      TweenMax.staggerFromTo(this.$refs.allParts, 0.5, {
        opacity: action === 'show' ? 1 : 0
      }, {
        opacity: action === 'show' ? 0 : 1,
        ease: 'Power2.easeOut',
        delay: action === 'show' ? 0 : 0.4
      }, .04)
      TweenMax.staggerFromTo(this.$refs.closeParts, 0.5, {
        opacity: action === 'show' ? 0 : 1
      }, {
        opacity: action === 'show' ? 1 : 0,
        ease: 'Power2.easeOut',
        delay: action === 'show' ? 0.4 : 0
      }, .04)
    }
  }
}
</script>