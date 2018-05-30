import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'ion-col'
})
export class Col {
  /**
   * The width of the column, in terms of how many columns it should take up.
   */
  @Prop() width?: string;


}
