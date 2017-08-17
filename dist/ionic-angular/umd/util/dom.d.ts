export declare function getCss(docEle: HTMLElement): {
    transform?: string;
    transition?: string;
    transitionDuration?: string;
    transitionDelay?: string;
    transitionTimingFn?: string;
    transitionStart?: string;
    transitionEnd?: string;
    transformOrigin?: string;
    animationDelay?: string;
};
export declare function pointerCoord(ev: any): PointerCoordinates;
export declare function hasPointerMoved(threshold: number, startCoord: PointerCoordinates, endCoord: PointerCoordinates): boolean;
export declare function isTextInput(ele: any): boolean;
export declare const NON_TEXT_INPUT_REGEX: RegExp;
export declare function copyInputAttributes(srcElement: HTMLElement, destElement: HTMLElement): void;
export interface PointerCoordinates {
    x?: number;
    y?: number;
}
