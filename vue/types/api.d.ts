import { PluginFunction } from 'vue';
import { ApiCache } from './interfaces';
import ProxyController from './proxy-controller';
import ProxyMenuController from './proxy-menu-controller';
import ProxyDelegateController from './proxy-delegate-controller';
export default class Api {
    static cache: ApiCache;
    static installed: boolean;
    static install: PluginFunction<never>;
    readonly actionSheetController: ProxyController;
    readonly alertController: ProxyController;
    readonly loadingController: ProxyController;
    readonly menuController: ProxyMenuController;
    readonly modalController: ProxyDelegateController;
    readonly popoverController: ProxyDelegateController;
    readonly toastController: ProxyController;
}
//# sourceMappingURL=api.d.ts.map