import Vue from 'vue'
import Router from '../src/router.js'

describe('Router', () => {
  it('Installs correctly', () => {
    Vue.use(Router)

    const app = new Vue({
      router: new Router(),
    })

    expect(typeof app.$router).toBe('object')
    expect(typeof app.$options.components.IonVueRouter).toBe('function')
    expect(Router.install()).toBeFalsy()
  })

  it('Navigates correctly', () => {
    const r = new Router({ mode: 'abstract' })

    r.push('/')
    expect(r.viewCount).toBe(1)
    expect(r.direction).toBe(1)
    expect(r.canGoBack()).toBeFalsy()

    r.push('/foo')
    expect(r.viewCount).toBe(2)
    expect(r.direction).toBe(1)
    expect(r.canGoBack()).toBeTruthy()

    r.push('/bar')
    expect(r.viewCount).toBe(3)
    expect(r.direction).toBe(1)
    expect(r.canGoBack()).toBeTruthy()

    r.go(-1)
    expect(r.viewCount).toBe(2)
    expect(r.direction).toBe(-1)
    expect(r.canGoBack()).toBeTruthy()

    r.go(-1)
    expect(r.viewCount).toBe(1)
    expect(r.direction).toBe(-1)
    expect(r.canGoBack()).toBeFalsy()
  })
})
