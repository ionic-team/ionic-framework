/**
 * @hidden
 */
export declare class Form {
    private _focused;
    private _ids;
    private _inputs;
    register(input: IonicFormInput): void;
    deregister(input: IonicFormInput): void;
    setAsFocused(input: IonicFormInput): void;
    unsetAsFocused(input: IonicFormInput): void;
    /**
     * Focuses the next input element, if it exists.
     */
    tabFocus(currentInput: IonicFormInput): void;
    nextId(): number;
}
/**
 * @hidden
 */
export declare abstract class IonicTapInput implements IonicFormInput {
    abstract initFocus(): void;
    abstract checked: boolean;
    abstract disabled: boolean;
}
/**
 * @hidden
 */
export declare abstract class IonicFormInput {
    abstract initFocus(): void;
}
