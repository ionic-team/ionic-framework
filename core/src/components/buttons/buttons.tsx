import { Component, ComponentInterface, Prop } from '@stencil/core';

@Component({
  tag: 'ion-buttons',
  styleUrls: {
    ios: 'buttons.ios.scss',
    md: 'buttons.md.scss'
  },
  scoped: true,
})
export class Buttons implements ComponentInterface {
  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;
}
