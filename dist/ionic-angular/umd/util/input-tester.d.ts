import { BaseInput } from './base-input';
export declare const TEXT_CORPUS: any;
export declare const NUMBER_CORPUS: any[];
export declare const BOOLEAN_CORPUS: any[];
export declare const ANY_CORPUS: any[];
export interface TestConfig {
    defaultValue: any;
    corpus: any;
    testItem?: boolean;
    testForm?: boolean;
    onValueChange?: (value: any) => boolean;
    onFocusChange?: (isFocused: boolean) => boolean;
}
export declare function commonInputTest<T>(input: BaseInput<T>, config: TestConfig): void;
