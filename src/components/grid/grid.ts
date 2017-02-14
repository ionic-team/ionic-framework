import { Directive } from '@angular/core';

/**
  * @private
  * @name Grid
  * @module ionic
  * @description
 */
@Directive({
  selector: 'ion-grid, [ion-grid]',
  host: {
    'class': 'grid'
  }
})
export class Grid {

}

/**
  * @private
  * @name Row
  * @module ionic
  * @description
 */
@Directive({
  selector: 'ion-row, [ion-row]',
  host: {
    'class': 'row'
  }
})
export class Row {

}

/**
  * @private
  * @name Column
  * @module ionic
  * @description
 */
@Directive({
  selector: 'ion-col, [ion-col]',
  host: {
    'class': 'col'
  }
})
export class Col {

}
