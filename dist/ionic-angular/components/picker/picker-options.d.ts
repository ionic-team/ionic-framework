export interface PickerOptions {
    buttons?: any[];
    columns?: PickerColumn[];
    cssClass?: string;
    enableBackdropDismiss?: boolean;
}
export interface PickerColumn {
    name?: string;
    align?: string;
    selectedIndex?: number;
    prevSelected?: number;
    prefix?: string;
    suffix?: string;
    options?: PickerColumnOption[];
    cssClass?: string;
    columnWidth?: string;
    prefixWidth?: string;
    suffixWidth?: string;
    optionsWidth?: string;
}
export interface PickerColumnOption {
    text?: string;
    value?: any;
    disabled?: boolean;
}
export declare const PICKER_OPT_SELECTED = "picker-opt-selected";
export declare const DECELERATION_FRICTION = 0.97;
export declare const FRAME_MS: number;
export declare const MAX_PICKER_SPEED = 60;
