import { Animation, AnimationBuilder, AnimationController, Config } from '../../index';
import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


@Component({
  tag: 'ion-picker',
  styleUrls: {
    ios: 'picker.ios.scss',
    md: 'picker.md.scss',
    wp: 'picker.wp.scss'
  },
  host: {
    theme: 'picker'
  }
})
export class Picker {
  private animation: Animation;
  private durationTimeout: any;
  private mode: string;

  @Element() private el: HTMLElement;

  @Event() private ionPickerDidLoad: EventEmitter;
  @Event() private ionPickerDidPresent: EventEmitter;
  @Event() private ionPickerWillPresent: EventEmitter;
  @Event() private ionPickerWillDismiss: EventEmitter;
  @Event() private ionPickerDidDismiss: EventEmitter;
  @Event() private ionPickerDidUnload: EventEmitter;

  @State() private showSpinner: boolean = null;
  @State() private spinner: string;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;
  @Prop() cssClass: string;
  @Prop() content: string;
  @Prop() dismissOnPageChange: boolean = false;
  @Prop() duration: number;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() id: string;
  @Prop() showBackdrop: boolean = true;
  @Prop() enableBackdropDismiss: boolean = true;

  @Prop() buttons: PickerButton[] = [];
  @Prop() columns: PickerColumn[] = [];

  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }

  private _present(resolve: Function) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    this.ionPickerWillPresent.emit({ picker: this });

    // get the user's animation fn if one was provided
    let animationBuilder = this.enterAnimation;

    if (!animationBuilder) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      animationBuilder = iOSEnterAnimation;
    }

    // build the animation and kick it off
    this.animationCtrl.create(animationBuilder, this.el).then(animation => {
      this.animation = animation;

      animation.onFinish((a: any) => {
        a.destroy();
        this.ionViewDidEnter();
        resolve();

      }).play();
    });
  }

  dismiss() {
    clearTimeout(this.durationTimeout);

    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise(resolve => {
      this.ionPickerWillDismiss.emit({ picker: this });

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;

      if (!animationBuilder) {
        // user did not provide a custom animation fn
        // decide from the config which animation to use
        animationBuilder = iOSLeaveAnimation;
      }

      // build the animation and kick it off
      this.animationCtrl.create(animationBuilder, this.el).then(animation => {
        this.animation = animation;

        animation.onFinish((a: any) => {
          a.destroy();
          this.ionPickerDidDismiss.emit({ picker: this });

          Context.dom.write(() => {
            this.el.parentNode.removeChild(this.el);
          });

          resolve();

        }).play();
      });
    });
  }

  protected ionViewDidUnload() {
    this.ionPickerDidUnload.emit({ picker: this });
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  protected ionViewDidLoad() {
    if (!this.spinner) {
      let defaultSpinner = 'lines';

      if (this.mode === 'md') {
        defaultSpinner = 'crescent';
      } else if (this.mode === 'wp') {
        defaultSpinner = 'circles';
      }

      this.spinner = this.config.get('pickerSpinner') || defaultSpinner;
    }

    if (this.showSpinner === null || this.showSpinner === undefined) {
      this.showSpinner = !!(this.spinner && this.spinner !== 'hide');
    }
    this.ionPickerDidLoad.emit({ picker: this });
  }

  protected ionViewDidEnter() {
    // blur the currently active element
    const activeElement: any = document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();

    // If there is a duration, dismiss after that amount of time
    if (typeof this.duration === 'number' && this.duration > 10) {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }

    this.ionPickerDidPresent.emit({ picker: this });
  }

  btnClick(button: PickerButton) {
    // if (!this.enabled) {
    //   return;
    // }

    // // keep the time of the most recent button click
    // this.lastClick = Date.now();

    let shouldDismiss = true;

    // if (button.handler) {
    //   // a handler has been provided, execute it
    //   // pass the handler the values from the inputs
    //   if (button.handler(this.getSelected()) === false) {
    //     // if the return value of the handler is false then do not dismiss
    //     shouldDismiss = false;
    //   }
    // }

    if (shouldDismiss) {
      this.dismiss();
    }
  }


  /**
   * @param {PickerColumn} column Picker toolbar button
   */
  @Method()
  addColumn(column: PickerColumn) {
    this.columns.push(column);
  }

  @Method()
  getColumn(name: string): PickerColumn {
    return this.getColumns().find(column => column.name === name);
  }

  @Method()
  getColumns(): PickerColumn[] {
    return this.columns;
  }

  protected backdropClick() {
    // TODO this.enabled
    if (this.enableBackdropDismiss) {
      let cancelBtn = this.buttons.find(b => b.role === 'cancel');
      if (cancelBtn) {
        this.btnClick(cancelBtn);
      } else {
        this.dismiss();
      }
    }
  }

  protected render() {
    let userCssClass = 'picker-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }

    let buttons = this.buttons
    .map(b => {
      if (typeof b === 'string') {
        b = { text: b };
      }
      if (!b.cssClass) {
        b.cssClass = '';
      }
      return b;
    })
    .filter(b => b !== null);

    console.log('picker render, columns', this.columns);
    let columns = this.columns;

    return [
      <ion-backdrop
        onClick={this.backdropClick.bind(this)}
        class={{
          'picker-backdrop': true,
          'hide-backdrop': !this.showBackdrop
        }}
      />,
      <div class='picker-wrapper' role='dialog'>
        <div class='picker-toolbar'>
          {buttons.map(b =>
            <div class={this.buttonWrapperClass(b)}>
              <button onClick={() => this.btnClick(b)} class={this.buttonClass(b)}>
                {b.text}
              </button>
            </div>
          )}
        </div>
        <div class="picker-columns">
          <div class="picker-above-highlight"></div>
          {columns.map(c =>
            <ion-picker-column col={c}></ion-picker-column>
          )}
          <div class="picker-below-highlight"></div>
        </div>
      </div>
    ];
  }

  buttonWrapperClass(button: PickerButton): CssClassMap {
    console.log('buttonWrapperClass', button);
    let buttonClass: string[] = !button.role
      ? ['picker-toolbar-button']
      : [`picker-toolbar-button`, `picker-toolbar-${button.role}`];
    return buttonClass.reduce((prevValue: any, cssClass: any) => {
      prevValue[cssClass] = true;
      return prevValue;
    }, {});
  }

  buttonClass(button: PickerButton): CssClassMap {
    let buttonClass: string[] = !button.cssClass
      ? ['picker-button']
      : [`picker-button`, `${button.cssClass}`];
    return buttonClass.reduce((prevValue: any, cssClass: any) => {
      prevValue[cssClass] = true;
      return prevValue;
    }, {});
  }
}




export interface PickerButton {
  text?: string;
  role?: string;
  cssClass?: string;
  handler?: (value: any) => boolean|void;
}

export interface PickerOptions {
  buttons?: PickerButton[];
  columns?: PickerColumn[];
  cssClass?: string;
  enableBackdropDismiss?: boolean;
}

export interface PickerColumn {
  name?: string;
  align?: string;
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options?: PickerColumnOption[];
  cssClass?: string;
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
}

export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
}

export interface PickerEvent extends Event {
  detail: {
    picker: Picker;
  };
}

export const PICKER_OPT_SELECTED = 'picker-opt-selected';
export const DECELERATION_FRICTION = 0.97;
export const FRAME_MS = (1000 / 60);
export const MAX_PICKER_SPEED = 60;





// /**
//  * @hidden
//  */
// @Component({
//   selector: 'ion-picker-cmp',
//   template: `
//     <ion-backdrop (click)="bdClick()"></ion-backdrop>
//     <div class="picker-wrapper">
//       <div class="picker-toolbar">
//         <div *ngFor="let b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">
//           <ion-button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button" clear>
//             {{b.text}}
//           </ion-button>
//         </div>
//       </div>
//       <div class="picker-columns">
//         <div class="picker-above-highlight"></div>
//         <div *ngFor="let c of d.columns" [col]="c" class="picker-col" (ionChange)="_colChange($event)"></div>
//         <div class="picker-below-highlight"></div>
//       </div>
//     </div>
//   `,
//   host: {
//     'role': 'dialog'
//   },
//   encapsulation: ViewEncapsulation.None,
// })
// export class PickerCmp {

//   @ViewChildren(PickerColumnCmp) _cols: QueryList<PickerColumnCmp>;
//   d: PickerOptions;
//   enabled: boolean;
//   lastClick: number;
//   id: number;
//   mode: string;
//   _gestureBlocker: BlockerDelegate;

//   constructor(
//     private _viewCtrl: ViewController,
//     private _elementRef: ElementRef,
//     config: Config,
//     private _plt: Platform,
//     gestureCtrl: GestureController,
//     params: NavParams,
//     renderer: Renderer
//   ) {
//     this._gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
//     this.d = params.data;
//     this.mode = config.get('mode');
//     renderer.setElementClass(_elementRef.nativeElement, `picker-${this.mode}`, true);

//     if (this.d.cssClass) {
//       this.d.cssClass.split(' ').forEach(cssClass => {
//         renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
//       });
//     }

//     this.id = (++pickerIds);
//     this.lastClick = 0;
//   }

//   ionViewWillLoad() {
//     // normalize the data
//     let data = this.d;

//     data.buttons = data.buttons.map(button => {
//       if (isString(button)) {
//         return { text: button };
//       }
//     });

//     // clean up dat data
//     data.columns = data.columns.map(column => {
//       if (!isPresent(column.options)) {
//         column.options = [];
//       }
//       column.selectedIndex = column.selectedIndex || 0;
//       column.options = column.options.map(inputOpt => {
//         let opt: PickerColumnOption = {
//           text: '',
//           value: '',
//           disabled: inputOpt.disabled,
//         };

//         if (isPresent(inputOpt)) {
//           if (isString(inputOpt) || isNumber(inputOpt)) {
//             opt.text = inputOpt.toString();
//             opt.value = inputOpt;

//           } else {
//             opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
//             opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
//           }
//         }

//         return opt;
//       });
//       return column;
//     });
//   }

//   ionViewDidLoad() {
//     this.refresh();
//   }

//   ionViewWillEnter() {
//     this._gestureBlocker.block();
//   }

//   ionViewDidLeave() {
//     this._gestureBlocker.unblock();
//   }

//   refresh() {
//     this._cols.forEach(column => column.refresh());
//   }

//   _colChange(selectedOption: PickerColumnOption) {
//     // one of the columns has changed its selected index
//     var picker = <Picker>this._viewCtrl;
//     picker.ionChange.emit(this.getSelected());
//   }

//   @HostListener('body:keyup', ['$event'])
//   _keyUp(ev: KeyboardEvent) {
//     if (this.enabled && this._viewCtrl.isLast()) {
//       if (ev.keyCode === KEY_ENTER) {
//         if (this.lastClick + 1000 < Date.now()) {
//           // do not fire this click if there recently was already a click
//           // this can happen when the button has focus and used the enter
//           // key to click the button. However, both the click handler and
//           // this keyup event will fire, so only allow one of them to go.
//           console.debug('picker, enter button');
//           let button = this.d.buttons[this.d.buttons.length - 1];
//           this.btnClick(button);
//         }

//       } else if (ev.keyCode === KEY_ESCAPE) {
//         console.debug('picker, escape button');
//         this.bdClick();
//       }
//     }
//   }

//   ionViewDidEnter() {
//     this._plt.focusOutActiveElement();

//     let focusableEle = this._elementRef.nativeElement.querySelector('button');
//     if (focusableEle) {
//       focusableEle.focus();
//     }
//     this.enabled = true;
//   }



//   dismiss(role: string): Promise<any> {
//     return this._viewCtrl.dismiss(this.getSelected(), role);
//   }

//   getSelected(): any {
//     let selected: {[k: string]: any} = {};
//     this.d.columns.forEach((col, index) => {
//       let selectedColumn = col.options[col.selectedIndex];
//       selected[col.name] = {
//         text: selectedColumn ? selectedColumn.text : null,
//         value: selectedColumn ? selectedColumn.value : null,
//         columnIndex: index,
//       };
//     });
//     return selected;
//   }

//   ngOnDestroy() {
//     assert(this._gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
//     this._gestureBlocker.destroy();

//   }
// }

// let pickerIds = -1;






// /**
//  * @hidden
//  */
// export class Picker extends ViewController {
//   private _app: App;

//   @Output() ionChange: EventEmitter<any>;

//   constructor(app: App, opts: PickerOptions = {}, config: Config) {
//     if (!opts) {
//       opts = {};
//     }
//     opts.columns = opts.columns || [];
//     opts.buttons = opts.buttons || [];
//     opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? Boolean(opts.enableBackdropDismiss) : true;

//     super(PickerCmp, opts, null);
//     this._app = app;
//     this.isOverlay = true;

//     this.ionChange = new EventEmitter<any>();

//     config.setTransition('picker-slide-in', PickerSlideIn);
//     config.setTransition('picker-slide-out', PickerSlideOut);
//   }

//   /**
//   * @hidden
//   */
//   getTransitionName(direction: string) {
//     let key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
//     return this._nav && this._nav.config.get(key);
//   }

//   /**
//    * @param {any} button Picker toolbar button
//    */
//   addButton(button: any) {
//     this.data.buttons.push(button);
//   }


//   refresh() {
//     assert(this._cmp, 'componentRef must be valid');
//     assert(this._cmp.instance.refresh, 'instance must implement refresh()');

//     this._cmp && this._cmp.instance.refresh && this._cmp.instance.refresh();
//   }

//   /**
//    * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
//    */
//   setCssClass(cssClass: string) {
//     this.data.cssClass = cssClass;
//   }

//   /**
//    * Present the picker instance.
//    *
//    * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
//    * @returns {Promise} Returns a promise which is resolved when the transition has completed.
//    */
//   present(navOptions: NavOptions = {}) {
//     return this._app.present(this, navOptions);
//   }

// }
