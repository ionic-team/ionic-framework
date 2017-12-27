import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss']
})
export class AboutPage {
  conferenceDate = '2047-05-17';

  constructor(public popoverCtrl: PopoverController) { }

  presentPopover(event: Event) {
    const popover = this.popoverCtrl.create({
      component: PopoverPage,
      ev: event
    });
    popover.present();
  }
}
