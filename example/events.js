var logEvent = function(data) {
  var e = document.getElementById('event-log');
  var l = document.createElement('div');
  l.innerHTML = 'EVENT: ' + data.type;
  console.log(data.event);
  e.appendChild(l);
}

var tb = document.getElementById('tap-button');
var sb = document.getElementById('swipe-button');

window.FM.onGesture('tap', function(e) {
  console.log('GOT TAP', e);
  logEvent({
    type: 'tap',
    event: e
  });
}, tb);
window.FM.onGesture('touch', function(e) {
  console.log('GOT TOUCH', e);
  logEvent({
    type: 'touch',
    event: e
  });
}, tb);

window.FM.onGesture('tap', function(e) {
  console.log('GOT TAP', e);
  logEvent({
    type: 'tap',
    event: e
  });
}, tb);
window.FM.onGesture('release', function(e) {
  console.log('GOT RELEASE', e);
  logEvent({
    type: 'release',
    event: e
  });
}, tb);
window.FM.onGesture('swipe', function(e) {
  console.log('GOT SWIPE', e);
  logEvent({
    type: 'swipe',
    event: e
  });
}, sb);
window.FM.onGesture('swiperight', function(e) {
  console.log('GOT SWIPE RIGHT', e);
  logEvent({
    type: 'swiperight',
    event: e
  });

  e.target.classList.add('swiperight');
}, sb);
window.FM.onGesture('swipeleft', function(e) {
  console.log('GOT SWIPE LEFT', e);
  logEvent({
    type: 'swipeleft',
    event: e
  });

  e.target.classList.add('swipeleft');
}, sb);
window.FM.onGesture('swipeup', function(e) {
  console.log('GOT SWIPE UP', e);
  logEvent({
    type: 'swipeup',
    event: e
  });
}, sb);
window.FM.onGesture('swipedown', function(e) {
  console.log('GOT SWIPE DOWN', e);
  logEvent({
    type: 'swipedown',
    event: e
  });
}, sb);
