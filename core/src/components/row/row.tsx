import { Component, ComponentInterface, Prop } from '@stencil/core';

@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true
})
export class Row implements ComponentInterface {
  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

  render() {
    return <slot></slot>;
  }
}
