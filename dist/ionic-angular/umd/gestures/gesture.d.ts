/**
 * @hidden
 * A gesture recognizer class.
 *
 * TODO(mlynch): Re-enable the DOM event simulation that was causing issues (or verify hammer does this already, it might);
 */
export declare class Gesture {
    private _hammer;
    private _options;
    private _callbacks;
    element: HTMLElement;
    direction: string;
    isListening: boolean;
    constructor(element: HTMLElement, opts?: any);
    options(opts: any): void;
    on(type: string, cb: Function): void;
    off(type: string, cb: Function): void;
    listen(): void;
    unlisten(): void;
    destroy(): void;
}
