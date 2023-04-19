import { Component, VERSION } from '@angular/core';
import { AnimationBuilder, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  angularVersion = VERSION;

  routerAnimation: AnimationBuilder = (_, opts) => {
    const { direction, enteringEl, leavingEl } = opts;
    const animation = this.animationCtrl.create().duration(500).easing('ease-out');
    const enteringAnimation = this.animationCtrl.create().addElement(enteringEl).beforeRemoveClass(['ion-page-invisible']);
    const leavingAnimation = this.animationCtrl.create().addElement(leavingEl).beforeRemoveClass(['ion-page-invisible']);
    if (direction === 'back') {
      enteringAnimation.fromTo('transform', 'translateX(-100%)', 'translateX(0%)');
      leavingAnimation.fromTo('transform', 'translateX(0%)', 'translateX(100%)');
    } else {
      enteringAnimation.fromTo('transform', 'translateX(100%)', 'translateX(0%)');
      leavingAnimation.fromTo('transform', 'translateX(0%)', 'translateX(-100%)');
    }
    return animation.addAnimation([enteringAnimation, leavingAnimation]);
  };

  constructor(private animationCtrl: AnimationController) {}
}
