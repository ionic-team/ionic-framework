import { Component, ComponentInterface, Prop } from '@stencil/core';

@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true
})
export class Grid implements ComponentInterface {

  /**
   * Indicates the direction of the component.
   * Defaults to the value of the `dir` attribute on the html element.
   */
  @Prop({ reflectToAttr: true }) dir: string = document.dir;

  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   */
  @Prop() fixed = false;

  hostData() {
    return {
      class: {
        'grid-fixed': this.fixed
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
