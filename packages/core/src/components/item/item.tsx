import { Component, Element, Listen, Method, Prop } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';

import { CssClassMap } from '../../index';

@Component({
  tag: 'ion-item',
  styleUrls: {
    ios: 'item.ios.scss',
    md: 'item.md.scss'
  }
})
export class Item {
  private ids: number = -1;
  private itemId: string;
  private inputs: any = [];

  private itemStyles: { [key: string]: CssClassMap } = Object.create(null);
  private label: any;

  @Element() private el: HTMLElement;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
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
  //   radio.labelId = 'lbl-' + this.itemId;
  // }

  @Method()
  getLabelText(): string {
    return this.label ? this.label.getText() : '';
  }

  protected ionViewWillLoad() {
    this.itemId = (++itemId).toString();
  }

  protected ionViewDidLoad() {
    // Add item-button classes to each ion-button in the item
    const buttons = this.el.querySelectorAll('ion-button') as any;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].itemButton = true;
    }

    this.label = this.el.querySelector('ion-label');

    // if (label) {
    //   this.label = label;
    //   this.labelId = label.id = ('lbl-' + this.itemId);
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
    return this.itemId + '-' + (++this.ids);
  }

  protected render() {
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
        </div>
        <div class='button-effect'></div>
      </TagType>
    );
  }


  // constructor() {
  //   this._setName(elementRef);
  //   this._hasReorder = !!reorder;
  //   this.itemId = form.nextId().toString();

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
  //     this.labelId = label.id = ('lbl-' + this.itemId);
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
