import {Animation} from '../collide/animation';
import {addEasing} from '../collide/easing';


const easing = [.36, .66, .04, 1];
const duration = 500;


class IOSTransition extends Animation {

  constructor(navCtrl) {

    this.duration(duration);

    addEasing('ios', easing);
    this.easing('ios');


    var enteringViewEle = navCtrl.enteringEle();


    var viewA = new Animation();
    viewA.elements( document.querySelectorAll('.square') )
         .to('translateX', translateX)

    this.addChild(row1);
  }



}
