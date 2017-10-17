import { Component, Element, Prop } from '@stencil/core';
import { getParentElement, getToolbarHeight } from '../../utils/helpers';
import { Config } from '../../index';


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
  @Prop({ context: 'config' }) config: Config;
  mode: string;

  hostData() {
    const pageChildren: HTMLElement[] = getParentElement(this.el).children;
    const headerHeight = getToolbarHeight('ION-HEADER', pageChildren, this.mode, '44px', '56px');
    const footerHeight = getToolbarHeight('ION-FOOTER', pageChildren, this.mode, '50px', '48px');

    return {
      class: {
        'statusbar-padding': this.config.getBoolean('statusbarPadding')
      },
      style: {
        'margin-top': headerHeight,
        'margin-bottom': footerHeight
      }
    };
  }

  protected render() {
    return (
      <slot></slot>
    );
  }
}
