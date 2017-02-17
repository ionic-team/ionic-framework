import { Directive } from '@angular/core';

/**
  * @name Row
  * @module ionic
  * @description
  *
  * Row description
  *
  * ## Row attributes
  *
  * By default, columns will stretch to fill the entire height of the row and wrap when necessary.
  * There are several attributes that can be added to a row to customize this behavior.
  *
  * | Property        | Description                                                                                                                                      |
  * |-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
  * | nowrap          | Adds `flex-wrap: nowrap`. Forces the columns to a single row.                                                                                    |
  * | wrap-reverse    | Adds `flex-wrap: wrap-reverse`. The columns will wrap in reverse.                                                                                |
  * | top             | Adds `align-items: flex-start`. All columns will be vertically aligned at the top, unless they specify their own alignment.                      |
  * | bottom          | Adds `align-items: flex-end`. All columns will be vertically aligned at the bottom, unless they specify their own alignment.                     |
  * | center          | Adds `align-items: center`. All columns will be vertically aligned in the center, unless they specify their own alignment.                       |
  * | stretch         | Adds `align-items: stretch`. All columns will be stretched to take up the entire height of the row, unless they specify their own alignment.     |
  * | baseline        | Adds `align-items: baseline`. All columns will be vertically aligned at their baselines, unless they specify their own alignment.                |
  *
  *
 */
@Directive({
  selector: 'ion-row, [ion-row]',
  host: {
    'class': 'row'
  }
})
export class Row {

}
