import VueRouter from 'vue-router'
import IonVueRouter from './components/ion-vue-router.vue'
import IonVueRouterTransitionless from './components/ion-vue-router-transitionless.vue'

const inBrowser = typeof window !== 'undefined'

// Detect environment (browser, module, etc.)
const _VueRouter = inBrowser && window.VueRouter ? window.VueRouter : VueRouter

// Extend the official VueRouter
export default class Router extends _VueRouter {
  constructor(...args) {
    super(...args)

    // The direction user navigates in
    this.direction = args.direction || 1

    // Override normal direction
    this.directionOverride = null

    // Number of views navigated
    this.viewCount = args.viewCount || 0

    // Stack of previous routes
    this.prevRouteStack = []

    // Extend the existing history object
    this.extendHistory()
  }
  extendHistory() {
    // Save a reference to the original method
    this.history._updateRoute = this.history.updateRoute

    this.history.updateRoute = nextRoute => {
      // Guesstimate the direction of the next route
      this.direction = this.guessDirection(nextRoute)

      // Override the direction
      if (this.directionOverride) {
        this.direction = this.directionOverride
      }

      // Increment or decrement the view count
      this.viewCount += this.direction

      // Call the original method
      this.history._updateRoute(nextRoute)

      // Reset direction for overrides
      this.directionOverride = null
    }
  }
  canGoBack() {
    // We can display the back button if we're not on /
    // or there were more than 1 views rendered
    return this.viewCount > 1 && this.currentRoute.fullPath.length > 1
  }
  guessDirection(nextRoute) {
    if (this.prevRouteStack.length !== 0) {
      const prevRoute = this.prevRouteStack[this.prevRouteStack.length - 1]

      // Last route is the same as the next one - go back
      // If we're going to / reset the stack otherwise pop a route
      if (prevRoute.fullPath === nextRoute.fullPath) {
        if (prevRoute.fullPath.length === 1) {
          this.prevRouteStack = []
        } else {
          this.prevRouteStack.pop()
        }
        return -1
      }
    }

    // Forward movement, push next route to stack
    if (this.history.current.fullPath !== nextRoute.fullPath) {
      this.prevRouteStack.push(this.history.current)
    }
    return 1
  }
}

Router.install = function(Vue, { disableIonicTransitions } = {}) {
  // If already installed - skip
  if (Router.install.installed) {
    return
  }

  Router.install.installed = true

  // Install the official VueRouter
  _VueRouter.install(Vue)

  // Register the IonVueRouter component globally
  // either with default Ionic transitions turned on or off
  Vue.component('IonVueRouter', disableIonicTransitions ? IonVueRouterTransitionless : IonVueRouter)
}

// Auto-install when Vue is found (i.e. in browser via <script> tag)
if (inBrowser && window.Vue) {
  window.Vue.use(Router, { disableIonicTransitions: window.disableIonicTransitions })
}
