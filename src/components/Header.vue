<template>
  <header class="header">
    <div class="header__item header__item--title" v-on:click="handleHomeClick">
      <router-link to="/" class="header__link js-hover" data-lock="home">Lookbook</router-link>
    </div>
    <span class="header__item header__item--about">
      <button class="header__btn header__btn--about js-hover js-hover--about" v-on:click="toggleMenu" data-lock="about" ref="aboutBtn">
        <span class="header__btn-text header__btn-text--about">
          <span class="header__part header__part--close" v-for="(part, index) in closeSplit" :key="`close-about-part-${index}`" ref="closeAboutParts">{{ part }}</span>
        </span>
        <span class="header__btn-text header__btn-text--about">
          <span class="header__part header__part--about" v-for="(part, index) in aboutSplit" :key="`about-part-${index}`" ref="aboutParts">{{ part }}</span>
        </span>
      </button>
    </span>
    <div class="header__item header__item--all">
      <button class="header__btn js-hover" data-lock="all" v-on:click="toggleMenu" ref="allBtn">
        <span class="header__btn-text">
          <span class="header__part header__part--close" v-for="(part, index) in closeSplit" :key="`close-all-part-${index}`" ref="closeAllParts">{{ part }}</span>
        </span>
        <span class="header__btn-text">
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
      aboutSplit: 'About'.split(''),
      allSplit: 'All'.split(''),
      closeSplit: 'Close'.split(''),
      aboutActive: false
    }
  },
  mounted() {
    this.$root.$on('toggleHeaderBtns', this.toggleBtns)
  },

  methods: {
    handleHomeClick() {
      if (this.$route.name === 'home' && this.menuActive) {
        this.$root.$emit('toggleMenu', 'hide', this.aboutActive)
        this.$emit('toggleMenuState')
      }
    },

    toggleMenu(e) {
      const about = e.currentTarget.classList.contains('header__btn--about')
      this.aboutActive = about

      if (!this.menuActive) {
        this.$root.$emit('toggleMenu', 'show', about)
      } else {
        this.$root.$emit('toggleMenu', 'hide', about)
      }

      this.$emit('toggleMenuState')

      // this.$refs.btn.classList.toggle('is-active')
    },

    resetAll() {
      TweenMax.set(this.$refs.allParts, { opacity: 1 })
      TweenMax.set(this.$refs.closeAllParts, { opacity: 0 })
      this.$root.$emit('toggleMenu', 'hide')
      this.aboutActive = false
    },

    toggleBtns(action, about) {
      let toggleParts
      let closeParts
      let btn

      if (this.$route.name === 'home') {
        toggleParts = about ? this.$refs.aboutParts : this.$refs.allParts
        closeParts = about ? this.$refs.closeAboutParts : this.$refs.closeAllParts
        btn = about ? this.$refs.allBtn : this.$refs.aboutBtn

        const btnTween = {
          opacity: action === 'show' ? 0 : 1,
          delay: action === 'show' ? 0.15 : .55
        }

        if (action === 'show') {
          btnTween['onComplete'] = () => {
            btn.style.display = 'none'
          }
        } else {
          btnTween['onStart'] = () => {
            btn.style.display = 'inline-block'
          }
        }
        TweenMax.to(btn, action === 'show' ? .2 : .35, btnTween)
      } else {
        toggleParts = this.$refs.allParts
        closeParts = this.$refs.closeAllParts
      }

      TweenMax.staggerFromTo(toggleParts, 0.5, {
        opacity: action === 'show' ? 1 : 0
      }, {
        opacity: action === 'show' ? 0 : 1,
        ease: 'Power2.easeOut',
        delay: action === 'show' ? 0 : .4
      }, .04)
      TweenMax.staggerFromTo(closeParts, 0.5, {
        opacity: action === 'show' ? 0 : 1
      }, {
        opacity: action === 'show' ? 1 : 0,
        ease: 'Power2.easeOut',
        delay: action === 'show' ? .4 : 0
      }, .04)
    }
  }
}
</script>