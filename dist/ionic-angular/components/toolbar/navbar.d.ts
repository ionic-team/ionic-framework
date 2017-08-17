import { ElementRef, Renderer } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { NavController } from '../../navigation/nav-controller';
import { ToolbarBase } from './toolbar-base';
import { ViewController } from '../../navigation/view-controller';
/**
 * @name Navbar
 * @description
 * Navbar acts as the navigational toolbar, which also comes with a back
 * button. A navbar can contain a `ion-title`, any number of buttons,
 * a segment, or a searchbar. Navbars must be placed within an
 * `<ion-header>` in order for them to be placed above the content.
 * It's important to note that navbar's are part of the dynamic navigation
 * stack. If you need a static toolbar, use ion-toolbar.
 *
 * @usage
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <button ion-button icon-only menuToggle>
 *       <ion-icon name="menu"></ion-icon>
 *     </button>
 *
 *     <ion-title>
 *       Page Title
 *     </ion-title>
 *
 *     <ion-buttons end>
 *       <button ion-button icon-only (click)="openModal()">
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/demos/src/navbar/
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
export declare class Navbar extends ToolbarBase {
    _app: App;
    private navCtrl;
    /**
     * @hidden
     */
    _backText: string;
    /**
     * @hidden
     */
    _bbIcon: string;
    /**
     * @hidden
     */
    _hidden: boolean;
    /**
     * @hidden
     */
    _hideBb: boolean;
    /**
     * @hidden
     */
    _sbPadding: boolean;
    /**
     * @input {boolean} If true, the back button will be hidden.
     */
    hideBackButton: boolean;
    constructor(_app: App, viewCtrl: ViewController, navCtrl: NavController, config: Config, elementRef: ElementRef, renderer: Renderer);
    backButtonClick(ev: UIEvent): void;
    /**
     * Set the text of the Back Button in the Nav Bar. Defaults to "Back".
     */
    setBackButtonText(text: string): void;
    /**
     * @hidden
     */
    didEnter(): void;
    /**
     * @hidden
     */
    setHidden(isHidden: boolean): void;
}
