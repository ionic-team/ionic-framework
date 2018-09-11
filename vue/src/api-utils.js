// A proxy method that initializes the controller and calls requested method
export function proxyMethod(tag, method, ...opts) {
  return initController(tag).then(ctrl => ctrl[method].apply(ctrl, opts))
}

// Initialize an Ionic controller and append it to DOM
export function initController(tag) {
  let element = document.querySelector(tag)

  if (element) {
    return element.componentOnReady()
  }

  return document.body.appendChild(document.createElement(tag)).componentOnReady()
}
