import { ElementRef } from '@angular/core';

/**
 * @private
 */
export abstract class RootNode {
  abstract getElementRef(): ElementRef;
  abstract _setIsPane(isPane: boolean): void;
  abstract _isSideContent(): boolean;
  enabled: boolean;
}
