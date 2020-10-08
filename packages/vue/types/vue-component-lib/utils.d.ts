import { FunctionalComponent } from 'vue';
export interface InputProps extends Object {
    modelValue: string | boolean;
}
export declare const defineContainer: <Props>(name: string, componentProps: string[], modelProp?: string | undefined) => FunctionalComponent<Props & InputProps, {}>;
//# sourceMappingURL=utils.d.ts.map