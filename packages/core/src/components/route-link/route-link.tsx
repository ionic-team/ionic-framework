import { Component, Prop } from '@stencil/core';
import { openURL } from '../../utils/theme';


@Component({
  tag: 'ion-anchor'
})
export class RouteLink {

  @Prop() href: string;

  render() {
    return <a
      href={this.href}
      onClick={(ev) => openURL(this.href, ev)}><slot/></a>;
  }
}
