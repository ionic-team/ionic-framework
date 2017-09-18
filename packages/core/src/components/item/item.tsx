import { Component, Element, HostElement, Listen, Method, Prop, State } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';

import { CssClassMap } from '../../index';

@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss',
    wp: 'item.wp.scss'
  }
})
export class Item {
  private ids: number = -1;
  private id: string;
  private inputs: any = [];

  private itemStyles: { [key: string]: CssClassMap } = Object.create(null);
  private label: any;

  // TODO get reorder from a parent list/group
  @State() reorder: boolean = false;

  @Element() private el: HTMLElement;

  @Prop() mode: string;
  @Prop() color: string;
  @Prop() href: string;

  @Listen('ionStyle')
  itemStyle(ev: UIEvent) {
    ev.stopPropagation();

    let hasChildStyleChange = false;

    let tagName: string = (ev.target as HTMLElement).tagName;
    let updatedStyles: any = ev.detail;

    for (var key in updatedStyles) {
      if (('item-' + key) !== key) {
        Object.defineProperty(updatedStyles, 'item-' + key, Object.getOwnPropertyDescriptor(updatedStyles, key));
        delete updatedStyles[key];
        hasChildStyleChange = true;
      }
    }

    this.itemStyles[tagName] = updatedStyles;

    // returning true tells the renderer to queue an update
    return hasChildStyleChange;
  }

  // TODO? this loads after radio group
  // @Listen('ionRadioDidLoad')
  // protected radioDidLoad(ev: RadioEvent) {
  //   const radio = ev.detail.radio;
  //   // register the input inside of the item
  //   // reset to the item's id instead of the radiogroup id
  //   radio.id = 'rb-' + this.registerInput('radio');
  //   radio.labelId = 'lbl-' + this.id;
  // }

  @Method()
  getLabelText(): string {
    return this.label ? this.label.getText() : '';
  }

  ionViewWillLoad() {
    this.id = (++itemId).toString();
  }

  ionViewDidLoad() {
    // Add item-button classes to each ion-button in the item
    const buttons = this.el.querySelectorAll('ion-button') as any;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].itemButton = true;
    }

    this.label = this.el.querySelector('ion-label') as HostElement;

    // if (label) {
    //   this.label = label;
    //   this.labelId = label.id = ('lbl-' + this.id);
    //   if (label.type) {
    //     this.setElementClass('item-label-' + label.type, true);
    //   }
    //   this.viewLabel = false;
    // }

    // if (this._viewLabel && this.inputs.length) {
    //   let labelText = this.getLabelText().trim();
    //   this._viewLabel = (labelText.length > 0);
    // }

    // if (this.inputs.length > 1) {
    //   this.setElementClass('item-multiple-inputs', true);
    // }
  }

  /**
   * @hidden
   */
  registerInput(type: string) {
    this.inputs.push(type);
    return this.id + '-' + (++this.ids);
  }

  render() {
    let childStyles = {};

    for (var key in this.itemStyles) {
      childStyles = Object.assign(childStyles, this.itemStyles[key]);
    }

    let themedClasses = {
      ...childStyles,
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
          { this.reorder
            ? <ion-reorder></ion-reorder>
            : null
          }
        </div>
        <div class='button-effect'></div>
      </TagType>
    );
  }


  // constructor() {
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
  // @ContentChildren(Icon)
  // set _icons(icons: QueryList<Icon>) {
  //   icons.forEach(icon => {
  //     icon.setElementClass('item-icon', true);
  //   });
  // }
}

var itemId = -1;
