import Vue from 'vue'
import Delegate from '../src/framework-delegate.js'

const delegate = new Delegate(Vue)

const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

describe('Framework delegation', () => {
  it('Attaches components to DOM', () => {
    expect.assertions(2)

    const component = {
      template: '<p>foo</p>',
    }

    const data = {
      data() {
        return { foo: 'bar' }
      },
    }

    return delegate.attachViewToDom(app, component, data, ['foo']).then(el => {
      expect(el.classList.contains('foo')).toBeTruthy()
      expect(el.__vue__.foo).toBe('bar')
      return
    })
  })

  it('Attaches lazy loaded components to DOM', () => {
    expect.assertions(2)

    const component = function() {
      return Promise.resolve({
        render(h) {
          return h('p')
        },
      })
    }

    const data = {
      data() {
        return { foo: 'bar' }
      },
    }

    return delegate.attachViewToDom(app, component, data, ['foo']).then(el => {
      expect(el.classList.contains('foo')).toBeTruthy()
      expect(el.__vue__.foo).toBe('bar')
      return
    })
  })

  it('Attaches HTML elements to DOM', () => {
    expect.assertions(1)
    const element = document.createElement('p')

    return delegate.attachViewToDom(app, element, null, ['foo']).then(el => {
      return expect(el.classList.contains('foo')).toBeTruthy()
    })
  })

  it('Removes from DOM', () => {
    expect.assertions(2)
    const div = document.querySelector('p')
    expect(typeof div.__vue__).toBe('object')

    return delegate.removeViewFromDom(app, div).then(() => {
      return expect(div.__vue__).toBe(null)
    })
  })
})
