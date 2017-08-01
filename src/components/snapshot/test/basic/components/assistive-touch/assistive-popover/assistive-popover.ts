import { Component } from '@angular/core';
import { IonicPage } from '../../../../../../../navigation/ionic-page';
import { AssistiveTouchProvider } from '../../../providers/assistive-touch/assistive-touch';
import { ViewController } from '../../../../../../../navigation/view-controller';
import { Platform } from '../../../../../../../platform/platform';

@IonicPage()
@Component({
  templateUrl: 'assistive-popover.html'
})
export class AssistivePopover {
  constructor(private assistive: AssistiveTouchProvider,
              private plt: Platform,
              private viewCtrl: ViewController) {}

  homeButton() {
    this.assistive.closeButton.emit();
    this.close();
  }

  flipDirection() {
    this.plt.setDir(this.plt.dir() === 'ltr' ? 'rtl' : 'ltr', true);
    this.close();
  }

  private close() {
    this.viewCtrl.dismiss();
  }
}
