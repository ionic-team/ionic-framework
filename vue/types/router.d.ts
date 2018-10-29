import VueRouter, { Route } from 'vue-router';
import { PluginFunction } from 'vue';
import { RouterArgs } from './interfaces';
declare const _VueRouter: typeof VueRouter;
export default class Router extends _VueRouter {
    direction: number;
    directionOverride: number | null;
    viewCount: number;
    prevRouteStack: Route[];
    history: any;
    static installed: boolean;
    static install: PluginFunction<never>;
    constructor(args?: RouterArgs);
    extendHistory(): void;
    canGoBack(): boolean;
    guessDirection(nextRoute: Route): number;
}
export {};
//# sourceMappingURL=router.d.ts.map