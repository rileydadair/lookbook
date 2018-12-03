/* eslint-disable */
import Smooth from './Smooth'

class Custom extends Smooth {
    
  constructor(opt) {
    super(opt)
    this.createExtraBound()
    this.resizing = false
    this.cache = null
    this.dom.divs = Array.prototype.slice.call(opt.divs, 0)
    this.dom.test = opt.test
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

    const unit = (this.vars.width / 3)

    let elsTotalWidth = 0

    this.dom.divs.forEach((el, index) => {
      elsTotalWidth += el.getBoundingClientRect().width
      // el.style.display = 'inline-block'
      // el.style.transform = 'none'
      // el.style.width = `${unit}px`
      
      const scrollX = this.vars.target
      const bounding = el.getBoundingClientRect()
      const bounds = {
        el: el,
        state: true,
        left: bounding.left + scrollX,
        right: bounding.right + scrollX,
        center: unit / 2
      }

      this.cache.push(bounds)
    })

    // console.log(elsTotalWidth)
    
    this.dom.section.style.width = `${this.vars.width}px`
    this.vars.bounding = elsTotalWidth - this.vars.width
  }
  
  run() {
    this.dom.divs.forEach(this.inViewport);
    this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1)
    super.run()
  }
  
  inViewport(el, index) {
    if(!this.cache || this.resizing) return
    
    const cache = this.cache[index]
    const current = this.vars.current
    const left = Math.round(cache.left - current)
    const right = Math.round(cache.right - current)
    const inview = right > 0 && left < this.vars.width
    
    // if(inview) {
    //   if(!el.state) {
    //       el.innerHTML = '<span>in viewport</span>'
    //       el.state = true
    //   }
    // } else {
    //   el.state = false
    //   el.innerHTML = ''
    // }
  }
}

export default Custom