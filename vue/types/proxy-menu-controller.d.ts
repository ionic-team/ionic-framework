import { ProxyMenuControllerInterface } from './interfaces';
export default class ProxyMenuController implements ProxyMenuControllerInterface {
    tag: string;
    constructor(tag: string);
    open(menuId?: string): Promise<boolean>;
    close(menuId?: string): Promise<boolean>;
    toggle(menuId?: string): Promise<boolean>;
    enable(shouldEnable: boolean, menuId?: string): Promise<HTMLElement>;
    swipeEnable(shouldEnable: boolean, menuId?: string): Promise<HTMLElement>;
    isOpen(menuId?: string): Promise<boolean>;
    isEnabled(menuId?: string): Promise<boolean>;
    get(menuId?: string): Promise<HTMLElement>;
    getOpen(): Promise<HTMLElement>;
    getMenus(): Promise<HTMLElement>;
}
//# sourceMappingURL=proxy-menu-controller.d.ts.map