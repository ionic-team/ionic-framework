import { Component, Element, HostElement, Listen, Prop, PropDidChange } from '@stencil/core';

import { SegmentButtonEvent } from '../../index';


/**
 * @name Segment
 * @description
 * A Segment is a group of buttons, sometimes known as Segmented Controls, that allow the user to interact with a compact group of a number of controls.
 * Segments provide functionality similar to tabs, selecting one will unselect all others. You should use a tab bar instead of a segmented control when you want to let the user move back and forth between distinct pages in your app.
 * You could use Angular's `ngModel` or `FormBuilder` API. For an overview on how `FormBuilder` works, checkout [Angular Forms](http://learnangular2.com/forms/), or [Angular FormBuilder](https://angular.io/docs/ts/latest/api/forms/index/FormBuilder-class.html)
 *
 *
 * ```html
 * <!-- Segment in a header -->
 * <ion-header>
 *   <ion-toolbar>
 *     <ion-segment [(ngModel)]="icons" color="secondary">
 *       <ion-segment-button value="camera">
 *         <ion-icon name="camera"></ion-icon>
 *       </ion-segment-button>
 *       <ion-segment-button value="bookmark">
 *         <ion-icon name="bookmark"></ion-icon>
 *       </ion-segment-button>
 *     </ion-segment>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 *   <!-- Segment in content -->
 *   <ion-segment [(ngModel)]="relationship" color="primary" (ionChange)="segmentChanged($event)">
 *     <ion-segment-button value="friends">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment in a form -->
 *   <form [formGroup]="myForm">
 *     <ion-segment formControlName="mapStyle" color="danger">
 *       <ion-segment-button value="standard">
 *         Standard
 *       </ion-segment-button>
 *       <ion-segment-button value="hybrid">
 *         Hybrid
 *       </ion-segment-button>
 *       <ion-segment-button value="sat">
 *         Satellite
 *       </ion-segment-button>
 *     </ion-segment>
 *   </form>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see [Angular Forms](http://learnangular2.com/forms/)
 */
@Component({
  tag: 'ion-segment',
  styleUrls: {
    ios: 'segment.ios.scss',
    md: 'segment.md.scss',
    wp: 'segment.wp.scss'
  },
  host: {
    theme: 'segment'
  }
})
export class Segment {
  buttons: NodeListOf<HostElement>;
  @Element() el: HTMLElement;

  @Prop({ state: true }) disabled: boolean = false;

  @Prop({ state: true }) value: string;

  @PropDidChange('value')
  changed(val: string) {
    this.selectButton(val);
  }

  ionViewDidLoad() {
    this.buttons = this.el.querySelectorAll('ion-segment-button') as NodeListOf<HostElement>;

    for (var i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i].$instance;

      button.activated = (button.value === this.value);

      // If there is no value set on the segment and a button
      // is checked we should activate it
      if (!this.value && button.checked) {
        button.activated = button.checked;
      }
    }
  }

  @Listen('ionClick')
  segmentClick(ev: SegmentButtonEvent) {
    let selectedButton = ev.segmentButton;

    this.value = selectedButton.value;
    this.selectButton(this.value);
  }

  selectButton(val: string) {
    for (var i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i].$instance;
      button.activated = (button.value === val);
    }

    // returning true tells the renderer to queue an update
    return true;
  }

  hostData() {
    return {
      class: {
        'segment-disabled': this.disabled
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
