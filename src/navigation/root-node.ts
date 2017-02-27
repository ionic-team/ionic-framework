import { ElementRef } from '@angular/core';

/**
 * @private
 */
export abstract class RootNode {
  abstract getElementRef(): ElementRef;
  abstract _setIsPanel(isPanel: boolean): void;
  abstract _isSideContent(): boolean;
}
