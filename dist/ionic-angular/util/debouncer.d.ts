export interface Debouncer {
    debounce(callback: Function): void;
    cancel(): void;
}
export declare class TimeoutDebouncer implements Debouncer {
    wait: number;
    private timer;
    callback: Function;
    constructor(wait: number);
    debounce(callback: Function): void;
    schedule(): void;
    cancel(): void;
}
