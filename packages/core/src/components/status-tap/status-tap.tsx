import { Component, Listen, Method, Prop } from '@stencil/core';
import { DomController } from '../..';

import { domControllerAsync } from '../../utils/helpers';

@Component({
  tag: 'ion-status-tap'
})
export class StatusTap {

  @Prop({ context: 'dom' }) dom: DomController;

  @Listen('window:statusTap')
  statusTap() {
    handleTap(this);
  }

  @Method()
  mockTap() {
    return handleTap(this);
  }
}

export function handleTap(tap: StatusTap): Promise<any> {
  let width = 0;
  let height = 0;
  return domControllerAsync(tap.dom.read, () => {
    width = window.innerWidth;
    height = window.innerHeight;
  }).then(() => {
    const element = document.elementFromPoint(width / 2, height / 2);
    if (!element) {
      return;
    }
    const content = element.closest('.scroll-content');
    if (!content) {
      return;
    }

    throw new Error('Manu going to take over here');
  });
}
