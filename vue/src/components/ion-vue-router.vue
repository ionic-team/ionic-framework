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

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import CatchIonicGoBack from '../mixins/catch-ionic-go-back';
import { IonRouterOutlet } from '../interfaces';

@Component
export default class IonVueRouter extends mixins(CatchIonicGoBack) {
  @Prop({ default: 'default'}) name!: string;
  @Prop({ default: false }) bindCSS!: boolean;
  @Prop({ default: true }) animated!: boolean;

  // Currently visible component
  leavingEl: HTMLElement;
  // Component to be rendered
  enteringEl: HTMLElement;
  // Flag to see if we're still in a transition
  inTransition = false;
  customTransition = false;

  created() {
    // Cancel navigation if there's a running transition
    this.$router.beforeEach((to, _from, next) => {
      this.customTransition = to.meta.customTransition || false
      return this.$nextTick(() => {
        return next(!this.inTransition as false);
      })
    })
  }

  transition(enteringEl: HTMLElement, leavingEl: HTMLElement) {
    // Get the reference to the Ionic component handling the transitions
    const ionRouterOutlet = this.$refs.ionRouterOutlet as IonRouterOutlet;

    // The Ionic framework didn't load - skip animations
    if (typeof ionRouterOutlet.componentOnReady === 'undefined') {
      return;
    }

    // Skip animations if there's no component to navigate to
    // or the current and the "to-be-rendered" components are the same
    if (!enteringEl || enteringEl === leavingEl) {
      return;
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
      });
    });
  }

  // Instant transition if we don't want to animate
  getDuration() {
    return !this.animated ? 0 : undefined;
  }

  // Get the navigation direction from the router
  getDirection() {
    return this.$router.direction === 1 ? 'forward' : 'back';
  }

  // Set the component to be rendered before we render the new route
  beforeEnter(el: HTMLElement) {
    this.enteringEl = el;
  }

  // Remember the current component before we leave the route
  beforeLeave(el: HTMLElement) {
    this.leavingEl = el;
  }

  // Transition when we leave the route
  leave(el: HTMLElement, done: (opts?: boolean) => void): void {
    const promise = this.transition(this.enteringEl, el);

    this.inTransition = true;

    // Skip any transition if we don't get back a Promise
    if (!promise) {
      this.inTransition = false;
      return done();
    }

    // Perform navigation once the transition was finished
    promise.then(() => {
      this.inTransition = false;
      return done(true);
    });
  }

  // Enter the new route
  enter(_el: HTMLElement, done: () => void): void {
    done();
  }

  afterEnter(/* el */) {}
  enterCancelled(/* el */) {}
  afterLeave(/* el */) {}
  leaveCancelled(/* el */) {}
}
</script>
