import { Component, Listen, Method, Prop } from '@stencil/core';
import { DomController } from '../..';


@Component({
  tag: 'ion-status-tap'
})
export class StatusTap {

  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() duration = 300;

  @Listen('window:statusTap')
  statusTap() {
    this.tap();
  }

  @Method()
  mockTap() {
    this.tap();
  }

  private tap() {
    this.dom.read(() => {
      const width = window.innerWidth;
      const height = window.innerWidth;
      const el = document.elementFromPoint(width / 2, height / 2);
      if (!el) {
        return;
      }
      const scroll = el.closest('ion-scroll') as HTMLIonScrollElement;
      if (scroll) {
        (scroll as any).componentOnReady().then(() => {
          this.dom.write(() => scroll.scrollToTop(this.duration));
        });
      }
    });
  }
}
