import { Component, ElementRef, ViewChild } from '@angular/core';
import { PopoverController } from '../../../../src';
import { PopoverRadioPage } from './page-two';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;

  constructor(private popoverCtrl: PopoverController) {}

  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(PopoverRadioPage, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    popover.present({
      ev: ev
    });
  }
}
