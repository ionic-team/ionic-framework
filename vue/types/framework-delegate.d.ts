import { VueConstructor } from 'vue';
import { FrameworkDelegate, HTMLVueElement, WebpackFunction } from './interfaces';
export default class Delegate implements FrameworkDelegate {
    vue: VueConstructor;
    constructor(vue: VueConstructor);
    attachViewToDom(parentElement: HTMLElement, component: HTMLElement | WebpackFunction | object | VueConstructor, opts?: object, classes?: string[]): Promise<HTMLElement>;
    removeViewFromDom(_parentElement: HTMLElement, childElement: HTMLVueElement): Promise<void>;
    vueController(component: WebpackFunction | object | VueConstructor): Promise<VueConstructor>;
    vueComponent(controller: VueConstructor, opts?: object): import("vue/types/vue").CombinedVueInstance<import("vue/types/vue").Vue, object, object, object, Record<never, any>>;
}
//# sourceMappingURL=framework-delegate.d.ts.map