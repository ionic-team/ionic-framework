import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  tapTest(eleType) {
    console.debug('test click', eleType);
  }

}


function onEvent(ev) {
  var c = pointerCoord(ev);
  var l = '(' + c.x + ',' + c.y + ')';
  if (ev.isIonicTap) {
    l += ' isIonicTap';
  }
  console.debug(ev.type, l);
}

function pointerCoord(ev) {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  let c = { x: 0, y: 0 };
  if (ev) {
    const touches = ev.touches && ev.touches.length ? ev.touches : [ev];
    const e = (ev.changedTouches && ev.changedTouches[0]) || touches[0];
    if (e) {
      c.x = e.clientX || e.pageX || 0;
      c.y = e.clientY || e.pageY || 0;
    }
  }
  return c;
}

document.addEventListener('touchstart', onEvent);
document.addEventListener('touchcancel', onEvent);
document.addEventListener('touchend', onEvent);
document.addEventListener('mousedown', onEvent);
document.addEventListener('mouseup', onEvent);
document.addEventListener('click', onEvent);


var msgs = [];
var index = 0;
var timeId;
var winConsoleError = console.error;

console.error = function() {
  winConsoleError.apply(this, arguments);
  var args = ['ERROR!'];
  for (var i = 0, j = arguments.length; i < j; i++){
    args.push(arguments[i]);
  }
  console.debug.apply(this, args);
};

console.debug = function() {
  index++;
  var msg = [];
  msg.push(index);
  for (var i = 0, j = arguments.length; i < j; i++){
    msg.push(arguments[i]);
  }
  msg.push(getTime());

  msg = msg.join(', ');

  if(arguments[0] === 'ERROR!') msg = '<span style="color:red;font-weight:bold">' + msg + '</span>';

  if(arguments[0] === 'touchstart') msg = '<span style="color:blue">' + msg + '</span>';
  if(arguments[0] === 'touchend') msg = '<span style="color:darkblue">' + msg + '</span>';

  if(arguments[0] === 'mousedown') msg = '<span style="color:red">' + msg + '</span>';
  if(arguments[0] === 'mouseup') msg = '<span style="color:maroon">' + msg + '</span>';

  if(arguments[0] === 'click') msg = '<span style="color:purple">' + msg + '</span>';

  if(arguments[0] === 'test click') msg = '<span style="color:orange">' + msg + '</span>';

  msgs.unshift( msg );

  if(msgs.length > 25) {
    msgs.splice(25);
  }

  // do this so we try not to interfere with the device performance
  clearTimeout(timeId);
  timeId = setTimeout(function(){
    document.getElementById('logs').innerHTML = msgs.join('<br>');
  }, 100);

}

function getTime() {
  var d = new Date();
  return d.getSeconds() + '.' + d.getMilliseconds();
}
