import Vue from 'vue'

describe('Router node', () => {
  it('Sets globals correctly', () => {
    window.Vue = undefined
    global.Vue = Vue
    require('../src/router.js')
  })
})
