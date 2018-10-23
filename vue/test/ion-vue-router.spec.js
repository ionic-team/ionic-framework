import Vue from 'vue'
import Router from '../src/router.js'
import IonVueRouter from '../src/components/ion-vue-router.vue'

describe('IonVueRouter', () => {
  Vue.use(Router)
  Vue.config.ignoredElements.push(/^ion-/)

  const app = new Vue({
    components: { Toolbar: Toolbar() },
    render(h) {
      return h('ion-vue-router')
    },
    router: new Router({
      mode: 'abstract',
      routes: [{ path: '/', component: Home() }, { path: '/page', component: Page() }],
    }),
  }).$mount()

  it('Renders the home route correctly', done => {
    app.$router.push('/')
    setTimeout(() => {
      expect(app.$el.textContent.trim()).toBe('Home Go to page')
      done()
    }, 1)
  })

  it('Renders the page route correctly', done => {
    app.$router.push('/page')
    setTimeout(() => {
      expect(app.$el.textContent.trim()).toBe('Page Go home')
      done()
    }, 1)
  })

  it('Renders back route correctly', done => {
    app.$router.go(-1)
    setTimeout(() => {
      expect(app.$el.textContent.trim()).toBe('Home Go to page')
      done()
    }, 1)
  })

  it('Sets the default data correctly', () => {
    expect(typeof IonVueRouter.data).toBe('function')
    expect(IonVueRouter.data()).toMatchObject({
      leavingEl: null,
      enteringEl: null,
    })
  })

  it('Sets the default props correctly', () => {
    const constructor = Vue.extend(IonVueRouter)
    const component = new constructor({ router: new Router() })
    expect(component.bindCss).toBeFalsy()
    expect(component.animated).toBeTruthy()
    expect(component.name).toBe('default')
  })

  it('Transitions correctly', () => {
    expect.assertions(3)

    const constructor = Vue.extend(IonVueRouter)
    const component = new constructor({ router: new Router() })

    component.$refs.ionRouterOutlet = mockIonRouterOutlet()
    expect(component.transition()).toBeFalsy()

    component.enteringEl = document.createElement('div')
    component.leave(document.createElement('h1'), res => {
      expect(res).toBeTruthy()
    })

    return component
      .transition(document.createElement('div'), document.createElement('h1'))
      .then(res => {
        return expect(res).toBeTruthy()
      })
  })

  it('Gets duration correctly', () => {
    const constructor = Vue.extend(IonVueRouter)
    const component = new constructor({ router: new Router() })

    expect(component.getDuration()).toBe(undefined)

    component.animated = false
    expect(component.getDuration()).toBe(0)
  })

  it('Gets direction correctly', () => {
    const constructor = Vue.extend(IonVueRouter)
    const component = new constructor({ router: new Router() })

    expect(component.getDirection()).toBe('forward')

    component.$router.direction = -1
    expect(component.getDirection()).toBe('back')
  })

  it('Runs stub methods correctly', () => {
    const constructor = Vue.extend(IonVueRouter)
    const component = new constructor({ router: new Router() })

    component.enterCancelled()
    component.leaveCancelled()
  })
})

function Toolbar() {
  return Vue.component('Toolbar', {
    name: 'Toolbar',
    props: {
      backURL: { type: String, default: '' },
      title: { type: String, default: '' },
    },
    template: `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button :default-href="backURL"/>
          </ion-buttons>
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>`,
  })
}

function Home() {
  return Vue.component('Home', {
    template: `
      <ion-page class="ion-page">
        <toolbar title="Home"/>
        <ion-content class="ion-content" padding>
          <router-link to="/page">Go to page</router-link>
        </ion-content>
      </ion-page>`,
  })
}

function Page() {
  return Vue.component('Page', {
    methods: {
      goHome() {
        this.$router.back()
      },
    },
    template: `
      <ion-page class="ion-page">
        <toolbar title="Page"/>
        <ion-content class="ion-content" padding>
          <ion-button @click="goHome">Go home</ion-button>
        </ion-content>
      </ion-page>`,
  })
}

function mockIonRouterOutlet() {
  return {
    componentOnReady() {
      return new Promise(resolve => {
        return resolve({
          commit() {
            return true
          },
        })
      })
    },
  }
}
