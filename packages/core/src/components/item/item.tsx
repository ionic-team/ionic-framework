import { Component, Element, Prop, Listen } from '@stencil/core';
import { CssClassMap } from '../../index';
import { createThemedClasses } from '../../utils/theme';


@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss',
    wp: 'item.wp.scss'
  }
})
export class Item {
  private childStyles: CssClassMap = Object.create(null);

  @Element() private el: HTMLElement;

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() href: string;

  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    let hasChildStyleChange = false;
    let updatedStyles: any = ev.detail;

    for (var key in updatedStyles) {
      if (updatedStyles[key] !== this.childStyles['item-' + key]) {
        this.childStyles['item-' + key] = updatedStyles[key];
        hasChildStyleChange = true;
      }
    }

    // returning true tells the renderer to queue an update
    return hasChildStyleChange;
  }

  ionViewDidLoad() {
    // Add item-button classes to each ion-button in the item
    const buttons = this.el.querySelectorAll('ion-button') as any;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].itemButton = true;
    }
  }

  render() {
    let themedClasses = {
      ...this.childStyles,
      ...createThemedClasses(this.mode, this.color, 'item'),
      'item-block': true
    };

    // TODO add support for button items
    const TagType = this.href ? 'a' : 'div';

    return (
      <TagType class={themedClasses}>
        <slot name='start'></slot>
        <div class='item-inner'>
          <div class='input-wrapper'>
            <slot></slot>
          </div>
          <slot name='end'></slot>
        </div>
      </TagType>
    );

    // template:
    //   '<ng-content select="[slot="start"],ion-checkbox:not([slot="end"])"></ng-content>' +
    //   '<div class="item-inner">' +
    //     '<div class="input-wrapper">' +
    //       '<ng-content select="ion-label"></ng-content>' +
    //       '<ion-label *ngIf="_viewLabel">' +
    //         '<ng-content></ng-content>' +
    //       '</ion-label>' +
    //       '<ng-content select="ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]"></ng-content>' +
    //     '</div>' +
    //     '<ng-content select="[slot="end"],ion-radio,ion-toggle"></ng-content>' +
    //     '<ion-reorder *ngIf="_hasReorder"></ion-reorder>' +
    //   '</div>' +
    //   '<div class="button-effect"></div>',
  }


  // _ids: number = -1;
  // _inputs: Array<string> = [];
  // _label: Label;
  // _viewLabel: boolean = true;
  // _name: string = 'item';
  // _hasReorder: boolean;

  // /**
  //  * @hidden
  //  */
  // id: string;

  // /**
  //  * @hidden
  //  */
  // labelId: string = null;

  // constructor(
  //   form: Form,
  //   config: Config,
  //   elementRef: ElementRef,
  //   renderer: Renderer,
  //   @Optional() reorder: ItemReorder
  // ) {
  //   super(config, elementRef, renderer, 'item');

  //   this._setName(elementRef);
  //   this._hasReorder = !!reorder;
  //   this.id = form.nextId().toString();

  //   // auto add "tappable" attribute to ion-item components that have a click listener
  //   if (!(<any>renderer).orgListen) {
  //     (<any>renderer).orgListen = renderer.listen;
  //     renderer.listen = function(renderElement: HTMLElement, name: string, callback: Function): Function {
  //       if (name === 'click' && renderElement.setAttribute) {
  //         renderElement.setAttribute('tappable', '');
  //       }
  //       return (<any>renderer).orgListen(renderElement, name, callback);
  //     };
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // registerInput(type: string) {
  //   this._inputs.push(type);
  //   return this.id + '-' + (++this._ids);
  // }

  // /**
  //  * @hidden
  //  */
  // ngAfterContentInit() {
  //   if (this._viewLabel && this._inputs.length) {
  //     let labelText = this.getLabelText().trim();
  //     this._viewLabel = (labelText.length > 0);
  //   }

  //   if (this._inputs.length > 1) {
  //     this.setElementClass('item-multiple-inputs', true);
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // _updateColor(newColor: string, componentName?: string) {
  //   componentName = componentName || 'item'; // item-radio
  //   this._setColor(newColor, componentName);
  // }

  // /**
  //  * @hidden
  //  */
  // _setName(elementRef: ElementRef) {
  //   let nodeName = elementRef.nativeElement.nodeName.replace('ION-', '');

  //   if (nodeName === 'LIST-HEADER' || nodeName === 'ITEM-DIVIDER') {
  //     this._name = nodeName;
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // getLabelText(): string {
  //   return this._label ? this._label.text : '';
  // }

  // /**
  //  * @hidden
  //  */
  // @ContentChild(Label)
  // set contentLabel(label: Label) {
  //   if (label) {
  //     this._label = label;
  //     this.labelId = label.id = ('lbl-' + this.id);
  //     if (label.type) {
  //       this.setElementClass('item-label-' + label.type, true);
  //     }
  //     this._viewLabel = false;
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // @ViewChild(Label)
  // set viewLabel(label: Label) {
  //   if (!this._label) {
  //     this._label = label;
  //   }
  // }

  // /**
  //  * @hidden
  //  */
  // @ContentChildren(Button)
  // set _buttons(buttons: QueryList<Button>) {
  //   buttons.forEach(button => {
  //     if (!button._size) {
  //       button.setElementClass('item-button', true);
  //     }
  //   });
  // }

  // /**
  //  * @hidden
  //  */
  // @ContentChildren(Icon)
  // set _icons(icons: QueryList<Icon>) {
  //   icons.forEach(icon => {
  //     icon.setElementClass('item-icon', true);
  //   });
  // }
}
