import { ElementRef, EventEmitter, OnDestroy, QueryList, Renderer } from '@angular/core';
import { ActionSheet } from '../action-sheet/action-sheet';
import { Alert } from '../alert/alert';
import { Popover } from '../popover/popover';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { Option } from '../option/option';
/**
 * @name Select
 * @description
 * The `ion-select` component is similar to an HTML `<select>` element, however,
 * Ionic's select component makes it easier for users to sort through and select
 * the preferred option or options. When users tap the select component, a
 * dialog will appear with all of the options in a large, easy to select list
 * for users.
 *
 * The select component takes child `ion-option` components. If `ion-option` is not
 * given a `value` attribute then it will use its text as the value.
 *
 * If `ngModel` is bound to `ion-select`, the selected value will be based on the
 * bound value of the model. Otherwise, the `selected` attribute can be used on
 * `ion-option` components.
 *
 * ### Interfaces
 *
 * By default, the `ion-select` uses the {@link ../../alert/AlertController AlertController API}
 * to open up the overlay of options in an alert. The interface can be changed to use the
 * {@link ../../action-sheet/ActionSheetController ActionSheetController API} or
 * {@link ../../popover/PopoverController PopoverController API} by passing `action-sheet` or `popover`,
 * respectively, to the `interface` property. Read on to the other sections for the limitations
 * of the different interfaces.
 *
 * ### Single Value: Radio Buttons
 *
 * The standard `ion-select` component allows the user to select only one
 * option. When selecting only one option the alert interface presents users with
 * a radio button styled list of options. The action sheet interface can only be
 * used with a single value select. If the number of options exceed 6, it will
 * use the `alert` interface even if `action-sheet` is passed. The `ion-select`
 * component's value receives the value of the selected option's value.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Gender</ion-label>
 *   <ion-select [(ngModel)]="gender">
 *     <ion-option value="f">Female</ion-option>
 *     <ion-option value="m">Male</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Multiple Value: Checkboxes
 *
 * By adding the `multiple="true"` attribute to `ion-select`, users are able
 * to select multiple options. When multiple options can be selected, the alert
 * overlay presents users with a checkbox styled list of options. The
 * `ion-select multiple="true"` component's value receives an array of all the
 * selected option values. In the example below, because each option is not given
 * a `value`, then it'll use its text as the value instead.
 *
 * Note: the `action-sheet` and `popover` interfaces will not work with a multi-value select.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Toppings</ion-label>
 *   <ion-select [(ngModel)]="toppings" multiple="true">
 *     <ion-option>Bacon</ion-option>
 *     <ion-option>Black Olives</ion-option>
 *     <ion-option>Extra Cheese</ion-option>
 *     <ion-option>Mushrooms</ion-option>
 *     <ion-option>Pepperoni</ion-option>
 *     <ion-option>Sausage</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Select Buttons
 * By default, the two buttons read `Cancel` and `OK`. Each button's text
 * can be customized using the `cancelText` and `okText` attributes:
 *
 * ```html
 * <ion-select okText="Okay" cancelText="Dismiss">
 *   ...
 * </ion-select>
 * ```
 *
 * The `action-sheet` and `popover` interfaces do not have an `OK` button, clicking
 * on any of the options will automatically close the overlay and select
 * that value.
 *
 * ### Select Options
 *
 * Since `ion-select` uses the `Alert`, `Action Sheet` and `Popover` interfaces, options can be
 * passed to these components through the `selectOptions` property. This can be used
 * to pass a custom title, subtitle, css class, and more. See the
 * {@link ../../alert/AlertController/#create AlertController API docs},
 * {@link ../../action-sheet/ActionSheetController/#create ActionSheetController API docs}, and
 * {@link ../../popover/PopoverController/#create PopoverController API docs}
 * for the properties that each interface accepts.
 *
 * For example, to change the `mode` of the overlay, pass it into `selectOptions`.
 *
 * ```html
 * <ion-select [selectOptions]="selectOptions">
 *   ...
 * </ion-select>
 * ```
 *
 * ```ts
 * this.selectOptions = {
 *   title: 'Pizza Toppings',
 *   subTitle: 'Select your toppings',
 *   mode: 'md'
 * };
 * ```
 *
 * ### Object Value References
 *
 * When using objects for select values, it is possible for the identities of these objects to
 * change if they are coming from a server or database, while the selected value's identity
 * remains the same. For example, this can occur when an existing record with the desired object value
 * is loaded into the select, but the newly retrieved select options now have different identities. This will
 * result in the select appearing to have no value at all, even though the original selection in still intact.
 *
 * Using the `compareWith` `Input` is the solution to this problem
 *
 * ```html
 * <ion-item>
 *   <ion-label>Employee</ion-label>
 *   <ion-select [(ngModel)]="employee" [compareWith]="compareFn">
 *     <ion-option *ngFor="let employee of employees" [value]="employee">{{employee.name}}</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ```ts
 * compareFn(e1: Employee, e2: Employee): boolean {
 *   return e1 && e2 ? e1.id === e2.id : e1 === e2;
 * }
 * ```
 *
 * @demo /docs/demos/src/select/
 */
export declare class Select extends BaseInput<any> implements OnDestroy {
    private _app;
    config: Config;
    deepLinker: DeepLinker;
    _multi: boolean;
    _options: QueryList<Option>;
    _overlay: ActionSheet | Alert | Popover;
    _texts: string[];
    _text: string;
    _compareWith: (o1: any, o2: any) => boolean;
    /**
     * @input {string} The text to display on the cancel button. Default: `Cancel`.
     */
    cancelText: string;
    /**
     * @input {string} The text to display on the ok button. Default: `OK`.
     */
    okText: string;
    /**
     * @input {string} The text to display when the select is empty.
     */
    placeholder: string;
    /**
     * @input {any} Any additional options that the `alert` or `action-sheet` interface can take.
     * See the [AlertController API docs](../../alert/AlertController/#create) and the
     * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) for the
     * create options for each interface.
     */
    selectOptions: any;
    /**
     * @input {string} The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
     */
    interface: string;
    /**
     * @input {string} The text to display instead of the selected option's value.
     */
    selectedText: string;
    /**
     * @input {Function} The function that will be called to compare object values
     */
    compareWith: (o1: any, o2: any) => boolean;
    /**
     * @output {any} Emitted when the selection was cancelled.
     */
    ionCancel: EventEmitter<Select>;
    constructor(_app: App, form: Form, config: Config, elementRef: ElementRef, renderer: Renderer, item: Item, deepLinker: DeepLinker);
    _click(ev: UIEvent): void;
    _keyup(): void;
    /**
     * @hidden
     */
    getValues(): any[];
    /**
     * Open the select interface.
     */
    open(ev?: UIEvent): void;
    /**
     * Close the select interface.
     */
    close(): Promise<any>;
    /**
     * @input {boolean} If true, the element can accept multiple values.
     */
    multiple: any;
    /**
     * @hidden
     */
    readonly text: string | string[];
    /**
     * @private
     */
    options: QueryList<Option>;
    _inputShouldChange(val: string[] | string): boolean;
    /**
     * TODO: REMOVE THIS
     * @hidden
     */
    _inputChangeEvent(): any;
    /**
     * @hidden
     */
    _updateText(): void;
    /**
     * @hidden
     */
    _inputUpdated(): void;
}
