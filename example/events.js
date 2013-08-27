var logEvent = function(data) {
  var e = document.getElementById('event-log');
  var l = document.createElement('div');
  l.innerHTML = 'EVENT: ' + data.type;
  console.log(data.event);
  e.appendChild(l);
}
window.FM.on('tap', function(e) {
  console.log('GOT TAP', e);
  logEvent({
    type: 'tap',
    event: e
  });
});
window.FM.on('touch', function(e) {
  console.log('GOT TOUCH', e);
  logEvent({
    type: 'touch',
    event: e
  });
});
window.FM.on('release', function(e) {
  console.log('GOT RELEASE', e);
  logEvent({
    type: 'release',
    event: e
  });
});
window.FM.on('swipe', function(e) {
  console.log('GOT SWIPE', e);
  logEvent({
    type: 'swipe',
    event: e
  });

  e.target.classList.add('swipeleft');
});
window.FM.on('swiperight', function(e) {
  console.log('GOT SWIPE RIGHT', e);
  logEvent({
    type: 'swiperight',
    event: e
  });

  e.target.classList.add('swiperight');
});
window.FM.on('swipeleft', function(e) {
  console.log('GOT SWIPE LEFT', e);
  logEvent({
    type: 'swipeleft',
    event: e
  });

  e.target.classList.add('swipeleft');
});
window.FM.on('swipeup', function(e) {
  console.log('GOT SWIPE UP', e);
  logEvent({
    type: 'swipeup',
    event: e
  });
});
window.FM.on('swipedown', function(e) {
  console.log('GOT SWIPE DOWN', e);
  logEvent({
    type: 'swipedown',
    event: e
  });
});
