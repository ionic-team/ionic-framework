import Vue from 'vue'
import Router from '../src/router.js'
import IonVueRouterTransitionless from '../src/components/ion-vue-router-transitionless.vue'

Vue.use(Router)

describe('IonVueRouter', () => {
  it('Catches back button click event', () => {
    const constructor = Vue.extend(IonVueRouterTransitionless)
    const component = new constructor({ router: new Router({ mode: 'abstract' }) })

    expect(component.catchIonicGoBack({})).toBeFalsy()

    component.$router.push('/')
    component.$router.push('/foo')
    expect(component.$route.fullPath).toBe('/foo')

    // Go back
    component.catchIonicGoBack(mockBackEvent('/'))
    expect(component.$route.fullPath).toBe('/')

    // Should not go back
    component.catchIonicGoBack(mockBackEvent())
    expect(component.$route.fullPath).toBe('/')

    // Go back to default route
    component.catchIonicGoBack(mockBackEvent('/bar'))
    expect(component.$route.fullPath).toBe('/bar')
  })
})

function mockBackEvent(route) {
  return {
    target: {
      closest() {
        return {
          defaultHref: route,
        }
      },
    },
    preventDefault() {},
  }
}
