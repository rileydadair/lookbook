/* eslint-disable */
import Smooth from './Smooth'

class Custom extends Smooth {
    
  constructor(opt) {
    super(opt)
    this.createExtraBound()
    this.resizing = false
    this.cache = null
    this.addTitle = opt.addTitle
    this.dom.divs = Array.prototype.slice.call(opt.divs, 0)
    this.dom.title = opt.title
  }
  
  createExtraBound() {
    ['getCache', 'inViewport']
    .forEach((fn) => this[fn] = this[fn].bind(this))
  }
  
  resize() {
    this.resizing = true
    this.getCache()
    super.resize()
    this.resizing = false
  }

  getCache() {
    this.cache = []

    const titleBounding = this.dom.title.getBoundingClientRect()
    this.titleCache = {
      right: titleBounding.right + this.vars.target - window.innerWidth,
      state: false
    }

    let elsTotalWidth = 0

    this.dom.divs.forEach((el, index) => {
      elsTotalWidth += el.getBoundingClientRect().width
      const scrollX = this.vars.target
      const bounding = el.getBoundingClientRect()
      const bounds = {
        el: el,
        state: true,
        left: bounding.left + scrollX,
        right: bounding.right + scrollX,
      }

      this.cache.push(bounds)
    })
    
    this.dom.section.style.width = `${this.vars.width}px`
    this.vars.bounding = elsTotalWidth - this.vars.width
  }
  
  run() {
    this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1)
    this.dom.title.style.transform = this.getTransform(this.vars.current * -.5)
    this.inViewport()
    super.run()    
  }
  
  inViewport() {
    if(!this.titleCache || this.resizing) return

    const cache = this.titleCache
    const current = this.vars.current
    const right = (cache.right / .5) - 600 // Divide the same amount that was multiplied in getTransform
    const inview = current > right
    
    if (inview && !this.titleCache.state) {
      this.titleCache.state = true;

      const titlePromise = this.addTitle()
        titlePromise.then(() => this.getCache()) // Update titleCache
    }
  }
}

export default Custom