import { Component, Element } from '@stencil/core';
import { getParentElement, getToolbarHeight } from '../../utils/helpers';
import { Ionic } from '../../index';


@Component({
  tag: 'ion-fixed',
  styleUrl: 'fixed.scss',
  // TODO REMOVE when https://github.com/ionic-team/stencil/issues/52 is done
  styleUrls: {
    ios: 'fixed.scss',
    md: 'fixed.scss',
    wp: 'fixed.scss'
  }
})
export class Fixed {
  @Element() private el: HTMLElement;
  mode: string;

  hostData() {
    const pageChildren: HTMLElement[] = getParentElement(this.el).children;
    const headerHeight = getToolbarHeight('ION-HEADER', pageChildren, this.mode, '44px', '56px');
    const footerHeight = getToolbarHeight('ION-FOOTER', pageChildren, this.mode, '50px', '48px');

    return {
      class: {
        'statusbar-padding': Ionic.config.getBoolean('statusbarPadding')
      },
      style: {
        'margin-top': headerHeight,
        'margin-bottom': footerHeight
      }
    };
  }

  render() {
    return (
      <slot></slot>
    );
  }
}
