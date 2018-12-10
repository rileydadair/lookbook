<template>
  <div class="menu" ref="menu">
    <div class="menu__wrap" ref="wrap">
      <nav class="menu__nav">
        <ul class="menu__list">
          <li class="menu__item" v-for="(item, index) in itemsList" :key="`menu-list-${index}`">
            <router-link :to="{ name: 'detail', params: { slug: item.slug } }" class="menu__link" event="" v-on:click.native="route(item.slug, index)" ref="links">
              <span class="menu__title">{{ item.title }}</span>
              <span class="menu__num">00{{ index + 1 }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'Menu',
  props: {
    items: Array
  },
  data() {
    return {
      itemsList: this.items,
      animation: {
        duration: 1,
        ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
      }
    }
  },
  methods: {
    route(slug, index) { // eslint-disable-line
      function routerPush(component) {
        component.$router.push(`/${slug}`)
        component.hide()
      }

      if (this.$refs.links[index].$el.classList.contains('router-link-exact-active')) {
        this.toggle('hide').then(() => this.hide())
      } else {
        this.$root.$emit('toggleOverlay', 'show', null, () => routerPush(this));
      }
    },

    hide() {
      TweenMax.set(this.$refs.menu, {
        y: '-100%',
        opacity: 0
      })
      this.$emit('toggleActive')
      document.body.classList.remove('menu-active')
    },

    toggle(action) {
      return new Promise(resolve => {
        TweenMax.to(this.$refs.menu, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: '-100%', opacity: 1 },
          y: action === 'hide' ? '-100%' : '0%',
        })
        TweenMax.to(this.$refs.wrap, this.animation.duration, {
          ease: this.animation.ease,
          startAt: action === 'hide' ? {} : { y: '100%' },
          y: action === 'hide' ? '100%' : '0%',
          onComplete() {
            resolve()
          }
        })
      })
    }
  }
}
</script>
