import { Directive } from '@angular/core';

/**
  * @name Column
  * @module ionic
  * @description
  *
  * Column description
  *
  * ## Column attributes
  *
  * By default, columns will stretch to fill the entire height of the row.
  * There are several attributes that can be added to a column to customize this behavior.
  *
  * | Property        | Description                                                                                                 |
  * |-----------------|-------------------------------------------------------------------------------------------------------------|
  * | top             | Adds `align-self: flex-start`. The column will be vertically aligned at the top.                            |
  * | bottom          | Adds `align-self: flex-end`. The column will be vertically aligned at the bottom.                           |
  * | center          | Adds `align-self: center`. The column will be vertically aligned in the center.                             |
  * | stretch         | Adds `align-self: stretch`. The column will be stretched to take up the entire height of the row.           |
  * | baseline        | Adds `align-self: baseline`. The column will be vertically aligned at its baselines.                        |
  *
  *
 */
@Directive({
  selector: 'ion-col, [ion-col]',
  host: {
    'class': 'col'
  }
})
export class Col {

}
