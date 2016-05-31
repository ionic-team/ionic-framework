import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  reload() {
    window.location.reload();
  }
}

document.addEventListener('click', (ev: any) => {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('touchstart', (ev: any) => {
  console.log(`TOUCH START, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('touchend', (ev: any) => {
  console.log(`TOUCH END, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('focusin', (ev: any) => {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
  console.log(`FOCUS IN, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('focusout', (ev: any) => {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
  console.log(`FOCUS OUT, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

ionicBootstrap(E2EPage);
