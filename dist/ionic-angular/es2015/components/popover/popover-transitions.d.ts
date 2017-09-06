import { PageTransition } from '../../transitions/page-transition';
/**
 * Animations for popover
 */
export declare class PopoverTransition extends PageTransition {
    mdPositionView(nativeEle: HTMLElement, ev: any): void;
    iosPositionView(nativeEle: HTMLElement, ev: any): void;
}
export declare class PopoverPopIn extends PopoverTransition {
    init(): void;
    play(): void;
}
export declare class PopoverPopOut extends PopoverTransition {
    init(): void;
}
export declare class PopoverMdPopIn extends PopoverTransition {
    init(): void;
    play(): void;
}
export declare class PopoverMdPopOut extends PopoverTransition {
    init(): void;
}
