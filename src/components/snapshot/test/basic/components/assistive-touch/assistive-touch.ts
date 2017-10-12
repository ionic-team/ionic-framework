import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { DomController } from '../../../../../../platform/dom-controller';
import { PopoverController } from '../../../../../popover/popover-controller';
import { AssistivePopover } from './assistive-popover/assistive-popover';

@Component({
  selector: 'assistive-touch',
  templateUrl: 'assistive-touch.html',
  host: {
    '(click)': 'openControl()'
  }
})
export class AssistiveTouchComponent implements AfterViewInit {
  private sideX = 'right';
  private sideY = 'bottom';
  private currentX: number = 2;
  private currentY: number = 150;

  private elemWidthOffset: number;
  private elemHeightOffset: number;

  constructor(private popoverCtrl: PopoverController,
              public element: ElementRef,
              public renderer: Renderer2,
              public domCtrl: DomController) {
  }

  ngAfterViewInit() {
    const hammer = new (<any>(window))['Hammer'](this.element.nativeElement);
    hammer.get('pan').set({direction: (<any>(window))['Hammer'].DIRECTION_ALL});

    hammer.on('panmove', this.handlePan.bind(this));
    hammer.on('panend', this.panEnd.bind(this));

    const rect = this.element.nativeElement.getBoundingClientRect();
    this.elemWidthOffset = rect.width / 2;
    this.elemHeightOffset = rect.height / 2;

    this.updatePosition();
  }

  private handlePan(ev: { center: { x: number, y: number } }) {
    let newX = ev.center.x;
    let newY = ev.center.y;

    this.sideX = (newX < window.innerWidth / 2) ? 'left' : 'right';
    this.sideY = (newY < window.innerHeight / 2) ? 'top' : 'bottom';

    if (this.sideX === 'right')
      newX = window.innerWidth - newX;
    newX -= this.elemWidthOffset;

    if (this.sideY === 'bottom')
      newY = window.innerHeight - newY;
    newY -= this.elemHeightOffset;

    this.currentX = newX > 2 ? newX : 2;
    this.currentY = newY > 2 ? newY : 2;

    this.updatePosition();
  }

  private panEnd() {
    if (this.currentX > this.currentY) {
      this.currentY = 2;
    } else {
      this.currentX = 2;
    }

    this.updatePosition();
  }

  private updatePosition() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, this.sideX === 'left' ? 'right' : 'left', 'auto');
      this.renderer.setStyle(this.element.nativeElement, this.sideX, this.currentX + 'px');

      this.renderer.setStyle(this.element.nativeElement, this.sideY === 'top' ? 'bottom' : 'top', 'auto');
      this.renderer.setStyle(this.element.nativeElement, this.sideY, this.currentY + 'px');
    });
  }

  openControl() {
    this.popoverCtrl.create(AssistivePopover).present();
  }
}
