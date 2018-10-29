import CatchIonicGoBack from '../mixins/catch-ionic-go-back';
declare const IonVueRouter_base: import("vue-class-component/lib/declarations").VueClass<CatchIonicGoBack>;
export default class IonVueRouter extends IonVueRouter_base {
    name: string;
    bindCSS: boolean;
    animated: boolean;
    leavingEl: HTMLElement;
    enteringEl: HTMLElement;
    inTransition: boolean;
    customTransition: boolean;
    created(): void;
    transition(enteringEl: HTMLElement, leavingEl: HTMLElement): Promise<boolean> | undefined;
    getDuration(): 0 | undefined;
    getDirection(): "forward" | "back";
    beforeEnter(el: HTMLElement): void;
    beforeLeave(el: HTMLElement): void;
    leave(el: HTMLElement, done: (opts?: boolean) => void): void;
    enter(_el: HTMLElement, done: () => void): void;
    afterEnter(): void;
    enterCancelled(): void;
    afterLeave(): void;
    leaveCancelled(): void;
}
export {};
//# sourceMappingURL=ion-vue-router.vue?rollup-plugin-vue=script.d.ts.map