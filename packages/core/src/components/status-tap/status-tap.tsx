import { Component, Listen, Method, Prop } from '@stencil/core';
import { DomController } from '../..';
import { domControllerAsync } from '../../utils/helpers';

@Component({
  tag: 'ion-status-tap'
})
export class StatusTap {

  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() duration = 300;

  @Listen('window:statusTap')
  statusTap() {
    return this.tap();
  }

  @Method()
  mockTap() {
    return this.tap();
  }

  private tap() {
    return domControllerAsync(this.dom.read, () => {
      const width = window.innerWidth;
      const height = window.innerWidth;
      const el = document.elementFromPoint(width / 2, height / 2);
      if (!el) {
        return null;
      }
      return el.closest('ion-scroll');
    }).then(([scroll]: HTMLIonScrollElement[]) => {
      return (scroll as any).componentOnReady();
    }).then((scroll: HTMLIonScrollElement) => {
      return domControllerAsync(this.dom.write, () => {
        return scroll.scrollToTop(this.duration);
      });
    });
  }
}
