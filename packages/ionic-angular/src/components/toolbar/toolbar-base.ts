import { ElementRef, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { ToolbarTitle } from './toolbar-title';

/**
 * @hidden
 */
export class ToolbarBase extends Ion {
  private _title: ToolbarTitle;

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'toolbar');
  }

  /**
   * @hidden
   */
  _setTitle(titleCmp: ToolbarTitle) {
    this._title = titleCmp;
  }

  /**
   * @hidden
   * Returns the toolbar title text if it exists or an empty string
   */
  getTitleText() {
    return (this._title && this._title.getTitleText()) || '';
  }

}
