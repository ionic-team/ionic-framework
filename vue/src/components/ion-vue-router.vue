<template>
  <ion-router-outlet
    ref="ionRouterOutlet"
    @click="catchIonicGoBack">
    <router-view
      v-if="customTransition"
      :name="name"/>
    <transition
      v-else
      :css="bindCSS"
      mode="in-out"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @enter-cancelled="enterCancelled"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
      @leave-cancelled="leaveCancelled"
    >
      <router-view :name="name"/>
    </transition>
  </ion-router-outlet>
</template>

<script>
import catchIonicGoBack from '../mixins/catch-ionic-go-back.js'

export default {
  name: 'IonVueRouter',
  mixins: [catchIonicGoBack],
  props: {
    // A name to call "named views" by
    name: {
      type: String,
      default: 'default',
    },
    // Set CSS classes during transitions
    bindCSS: {
      type: Boolean,
      default: false,
    },
    // Animate transitions or not
    animated: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // Currently visible component
      leavingEl: null,

      // Component to be rendered
      enteringEl: null,

      // Flag to see if we're still in a transition
      inTransition: false,

      customTransition: false,
    }
  },
  created() {
    // Cancel navigation if there's a running transition
    this.$router.beforeEach((to, from, next) => {
      this.customTransition = to.meta.customTransition || false
      return this.$nextTick(() => {
        return next(!this.inTransition)
      })
    })
  },
  methods: {
    transition(enteringEl, leavingEl) {
      // Get the reference to the Ionic component handling the transitions
      const ionRouterOutlet = this.$refs.ionRouterOutlet

      // The Ionic framework didn't load - skip animations
      if (typeof ionRouterOutlet.componentOnReady === 'undefined') {
        return
      }

      // Skip animations if there's no component to navigate to
      // or the current and the "to-be-rendered" components are the same
      if (!enteringEl || enteringEl === leavingEl) {
        return
      }

      // Add the proper Ionic classes, important for smooth transitions
      enteringEl.classList.add('ion-page', 'ion-page-invisible')

      // Commit to the transition as soon as the Ionic Router Outlet is ready
      return ionRouterOutlet.componentOnReady().then(el => {
        return el.commit(enteringEl, leavingEl, {
          deepWait: true,
          duration: this.getDuration(),
          direction: this.getDirection(),
          showGoBack: this.$router.canGoBack(),
        })
      })
    },
    // Instant transition if we don't want to animate
    getDuration() {
      return !this.animated ? 0 : undefined
    },
    // Get the navigation direction from the router
    getDirection() {
      return this.$router.direction === 1 ? 'forward' : 'back'
    },
    // Set the component to be rendered before we render the new route
    beforeEnter(el) {
      this.enteringEl = el
    },
    // Remember the current component before we leave the route
    beforeLeave(el) {
      this.leavingEl = el
    },
    // Transition when we leave the route
    leave(el, done) {
      const promise = this.transition(this.enteringEl, el)

      this.inTransition = true

      // Skip any transition if we don't get back a Promise
      if (!promise) {
        this.inTransition = false
        return done()
      }

      // Perform navigation once the transition was finished
      return promise.then(() => {
        this.inTransition = false
        return done(true)
      })
    },
    // Enter the new route
    enter(el, done) {
      done()
    },
    afterEnter(/* el */) {},
    enterCancelled(/* el */) {},
    afterLeave(/* el */) {},
    leaveCancelled(/* el */) {},
  },
}
</script>
