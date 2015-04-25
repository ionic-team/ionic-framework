import {transitionAction} from 'ionic/collide/transition-action'


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
    var p = transitionAction('start', this.elements, this.options, this.propertiesMap)

    p.then(() => {
      console.log('start success done')
    }).catch(() => {
      console.log('start error done')
    })
  }

  stop() {
    transitionAction('stop', this.elements, this.options, this.propertiesMap)
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
