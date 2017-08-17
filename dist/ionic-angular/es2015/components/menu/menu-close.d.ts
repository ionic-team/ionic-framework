import { MenuController } from '../app/menu-controller';
/**
 * @name MenuClose
 * @description
 * The `menuClose` directive can be placed on any button to close an open menu.
 *
 * @usage
 *
 * A simple `menuClose` button can be added using the following markup:
 *
 * ```html
 * <button ion-button menuClose>Close Menu</button>
 * ```
 *
 * To close a certain menu by its id or side, give the `menuClose`
 * directive a value.
 *
 * ```html
 * <button ion-button menuClose="left">Close Left Menu</button>
 * ```
 *
 * @demo /docs/demos/src/menu/
 * @see {@link /docs/components#menus Menu Component Docs}
 * @see {@link ../../menu/Menu Menu API Docs}
 */
export declare class MenuClose {
    private _menu;
    /**
     * @hidden
     */
    menuClose: string;
    constructor(_menu: MenuController);
    /**
    * @hidden
    */
    close(): void;
}
