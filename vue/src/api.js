import Delegate from './framework-delegate'
import ProxyController from './proxy-controller'
import ProxyMenuController from './proxy-menu-controller'
import ProxyDelegateController from './proxy-delegate-controller'

let _Vue, _Delegate

export default class Api {
  // Create or return a ActionSheetController instance
  get actionSheetController() {
    return getOrCreateController('ion-action-sheet-controller')
  }

  // Create or return an AlertController instance
  get alertController() {
    return getOrCreateController('ion-alert-controller')
  }

  // Create or return a LoadingController instance
  get loadingController() {
    return getOrCreateController('ion-loading-controller')
  }

  // Create or return a MenuController instance
  get menuController() {
    return getOrCreateMenuController('ion-menu-controller')
  }

  // Create or return a ModalController instance
  get modalController() {
    return getOrCreateDelegatedController('ion-modal-controller')
  }

  // Create or return a PopoverController instance
  get popoverController() {
    return getOrCreateDelegatedController('ion-popover-controller')
  }

  // Create or return a ToastController instance
  get toastController() {
    return getOrCreateController('ion-toast-controller')
  }
}

// Cached controllers
Api.cache = {
  'ion-action-sheet-controller': null,
  'ion-alert-controller': null,
  'ion-loading-controller': null,
  'ion-menu-controller': null,
  'ion-modal-controller': null,
  'ion-popover-controller': null,
  'ion-toast-controller': null,
}

Api.install = function(Vue) {
  // If installed - skip
  if (Api.install.installed && _Vue === Vue) {
    return
  }

  _Vue = Vue
  _Delegate = new Delegate(Vue)

  Api.install.installed = true

  // Ignore Ionic custom elements
  Vue.config.ignoredElements.push(/^ion-/)

  // Give access to the API methods
  Object.defineProperty(Vue.prototype, '$ionic', {
    get() {
      return new Api()
    },
  })
}

// Get existing Base controller instance or initialize a new one
function getOrCreateController(tag) {
  if (!Api.cache[tag]) {
    Api.cache[tag] = new ProxyController(tag)
  }

  return Api.cache[tag]
}

// Get existing Menu controller instance or initialize a new one
function getOrCreateMenuController(tag) {
  if (!Api.cache[tag]) {
    Api.cache[tag] = new ProxyMenuController(tag)
  }

  return Api.cache[tag]
}

// Get existing Delegated controller instance or initialize a new one
function getOrCreateDelegatedController(tag) {
  if (!Api.cache[tag]) {
    Api.cache[tag] = new ProxyDelegateController(tag, _Delegate)
  }

  return Api.cache[tag]
}
