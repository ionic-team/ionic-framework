import { Component, ComponentInterface, Prop } from '@stencil/core';

@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true
})
export class Thumbnail implements ComponentInterface {

  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

  render() {
    return <slot></slot>;
  }
}
