import { Component, Prop } from '@stencil/core';
import { openURL } from '../../utils/theme';


@Component({
  tag: 'ion-anchor'
})
export class Anchor {

  @Prop() href: string;

  @Prop() goBack = false;

  render() {
    return <a
      href={this.href}
      onClick={(ev) => openURL(this.href, ev, this.goBack)}>
        <slot/>
      </a>;
  }
}
