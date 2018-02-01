import { Component, ElementRef, ViewChild } from '@angular/core';

import { IonicPage, PopoverController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html',
  selector: 'e2e-popover-basic'
})
export class PageOne {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

  constructor(private popoverCtrl: PopoverController) {}

  presentListPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create('PopoverListPage');
    popover.present({
      ev: ev
    });
  }

  presentLongListPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create('PopoverLongListPage', {}, {
      cssClass: 'my-popover popover-class'
    });
    popover.present({
      ev: ev
    });
  }

  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create('PopoverRadioPage', {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    popover.present({
      ev: ev
    });
  }

  presentNoEventPopover() {
    this.popoverCtrl.create('PopoverListPage').present();
  }

}
