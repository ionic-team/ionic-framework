import {initTransition} from 'ionic2/collide/init-transition'
import {processTransition} from 'ionic2/collide/process-transition'



export class Transition {
  constructor(ele) {
    console.log('Transition', ele)

    if (!ele || ele.length === 0) return

    this.elements = !ele.length ? [ele] : ele
    ele = null

    // Animations that happen to this element
    this.animations = []

    // Sub transitions that happen to sub elements
    this.transitions = []

    this.options = {}
    this.propertiesMap = {}

    this.isRunning = false
  }

  start() {
    console.log('start')
    initTransition('start', this.elements, this.options, this.propertiesMap)
  }

  stop() {
    console.log('stop')
  }

  properties(val) {
    this.propertiesMap = val || {}
  }

  property(key, val) {
    this.propertiesMap[key] = val
  }

  removeProperty(key) {
    delete this.propertiesMap[key]
  }

  duration(val) {
    this.options.duration = val
  }

  easing(val) {
    this.options.easing = val
  }

}


export class IOSTransition extends Transition {
  constructor(ele) {
    super(ele)
  }
}
