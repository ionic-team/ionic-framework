import {dom} from 'ionic2/util'


let isKeyInputEnabled = false

function keyDown() {
  if (!isKeyInputEnabled) {
    isKeyInputEnabled = true
    dom.raf(enableKeyInput)
  }
}
dom.ready().then(function() {
  document.addEventListener('keydown', keyDown)
})


function enableKeyInput() {
  document.body.classList[isKeyInputEnabled ? 'add' : 'remove']('key-input')

  if (isKeyInputEnabled) {
    document.addEventListener('mousedown', pointerDown)
    document.addEventListener('touchstart', pointerDown)

  } else {
    document.removeEventListener('mousedown', pointerDown)
    document.removeEventListener('touchstart', pointerDown)
  }
}

function pointerDown() {
  isKeyInputEnabled = false
  dom.raf(enableKeyInput)
}

