import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
export declare function initA11y(s: Slides, plt: Platform): () => void;
export declare function makeFocusable(ele: HTMLElement): void;
export declare function addRole(ele: HTMLElement, role: string): void;
export declare function addLabel(ele: HTMLElement, label: string): void;
export declare function ariaDisable(ele: HTMLElement, isDisabled: boolean): void;
export declare function ariaHidden(ele: HTMLElement, isHidden: boolean): void;
