import {App} from '../../../../../ionic';


@App({
  templateUrl: 'main.html',
  config: {
    //scrollAssist: true
  }
})
class E2EApp {
  reload() {
    window.location.reload();
  }
}

document.addEventListener('click', function(ev) {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('touchstart', function(ev) {
  console.log(`TOUCH START, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('touchend', function(ev) {
  console.log(`TOUCH END, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('focusin', function(ev) {console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
  console.log(`FOCUS IN, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('focusout', function(ev) {console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
  console.log(`FOCUS OUT, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});
