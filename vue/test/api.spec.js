import Vue from 'vue'
import API from '../src/api.js'

const api = new API()

beforeEach(() => {
  HTMLElement.prototype.componentOnReady = function() {
    const el = this
    el.create = function(props = {}) {
      return Object.assign(el, props)
    }
    el.dismiss = function() {
      return el
    }
    el.getTop = el.dismiss
    el.open = el.create
    el.close = el.dismiss
    el.toggle = el.dismiss
    el.enable = el.dismiss
    el.swipeEnable = el.dismiss
    el.isOpen = el.dismiss
    el.isEnabled = el.dismiss
    el.get = el.dismiss
    el.getOpen = el.dismiss
    el.getMenus = el.dismiss

    return Promise.resolve(el)
  }
})

afterEach(() => {
  HTMLElement.prototype.componentOnReady = undefined
})

describe('API', () => {
  it('Installs correctly', () => {
    Vue.use(API)

    const app = new Vue()

    expect(typeof app.$ionic).toBe('object')
    expect(API.install(Vue)).toBeFalsy()
  })

  it('Creates action sheet controller', () => {
    expect.assertions(3)

    api.actionSheetController
      .dismiss()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.actionSheetController
      .getTop()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    return api.actionSheetController.create().then(c => {
      return expect(c).toBeTruthy()
    })
  })

  it('Creates alert controllers', () => {
    expect.assertions(3)

    // Creates initial element
    api.alertController
      .create({ foo: 'bar' })
      .then(c => {
        return expect(c.foo).toBe('bar')
      })
      .catch(err => err)

    // Returns previous element with extra props
    return api.alertController.create({ bar: 'foo' }).then(c => {
      expect(c.foo).toBe('bar')
      return expect(c.bar).toBe('foo')
    })
  })

  it('Creates loading controllers', done => {
    return api.loadingController.create({ bar: 'foo' }).then(c => {
      expect(c.bar).toBe('foo')
      return done()
    })
  })

  it('Creates modal controllers', done => {
    return api.modalController.create({ bar: 'foo' }).then(c => {
      expect(c.bar).toBe('foo')
      return done()
    })
  })

  it('Creates popover controllers', done => {
    return api.popoverController.create({ bar: 'foo' }).then(c => {
      expect(c.bar).toBe('foo')
      return done()
    })
  })

  it('Creates toast controllers', done => {
    return api.toastController.create({ bar: 'foo' }).then(c => {
      expect(c.bar).toBe('foo')
      return done()
    })
  })

  it('Creates menu controllers', done => {
    expect.assertions(10)

    api.menuController
      .close()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .toggle()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .enable()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .swipeEnable()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .isOpen()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .isEnabled()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .get()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .getOpen()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    api.menuController
      .getMenus()
      .then(c => {
        return expect(c).toBeTruthy()
      })
      .catch(err => err)

    return api.menuController.open({ bar: 'foo' }).then(c => {
      expect(c.bar).toBe('foo')
      return done()
    })
  })
})
