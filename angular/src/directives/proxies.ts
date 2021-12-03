/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import { Components } from '@ionic/core';




export declare interface IonAccordion extends Components.IonAccordion {}

@ProxyCmp({
  tagName: 'ion-accordion',
  customElement: undefined,
  inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value']
})
@Component({
  selector: 'ion-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value']
})
export class IonAccordion {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { AccordionGroupChangeEventDetail as IAccordionGroupAccordionGroupChangeEventDetail } from '@ionic/core';
export declare interface IonAccordionGroup extends Components.IonAccordionGroup {}

@ProxyCmp({
  tagName: 'ion-accordion-group',
  customElement: undefined,
  inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value']
})
@Component({
  selector: 'ion-accordion-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value']
})
export class IonAccordionGroup {
  /**
   * Emitted when the value property has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<IAccordionGroupAccordionGroupChangeEventDetail>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonApp extends Components.IonApp {}

@ProxyCmp({
  tagName: 'ion-app',
  customElement: undefined
})
@Component({
  selector: 'ion-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonApp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonAvatar extends Components.IonAvatar {}

@ProxyCmp({
  tagName: 'ion-avatar',
  customElement: undefined
})
@Component({
  selector: 'ion-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonAvatar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonBackButton extends Components.IonBackButton {}

@ProxyCmp({
  tagName: 'ion-back-button',
  customElement: undefined,
  inputs: ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type']
})
@Component({
  selector: 'ion-back-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type']
})
export class IonBackButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonBackdrop extends Components.IonBackdrop {}

@ProxyCmp({
  tagName: 'ion-backdrop',
  customElement: undefined,
  inputs: ['stopPropagation', 'tappable', 'visible']
})
@Component({
  selector: 'ion-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['stopPropagation', 'tappable', 'visible']
})
export class IonBackdrop {
  /**
   * Emitted when the backdrop is tapped. 
   */
  @Output() ionBackdropTap = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonBadge extends Components.IonBadge {}

@ProxyCmp({
  tagName: 'ion-badge',
  customElement: undefined,
  inputs: ['color', 'mode']
})
@Component({
  selector: 'ion-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode']
})
export class IonBadge {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonBreadcrumb extends Components.IonBreadcrumb {}

@ProxyCmp({
  tagName: 'ion-breadcrumb',
  customElement: undefined,
  inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target']
})
@Component({
  selector: 'ion-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target']
})
export class IonBreadcrumb {
  /**
   * Emitted when the breadcrumb has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the breadcrumb loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { BreadcrumbCollapsedClickEventDetail as IBreadcrumbsBreadcrumbCollapsedClickEventDetail } from '@ionic/core';
export declare interface IonBreadcrumbs extends Components.IonBreadcrumbs {}

@ProxyCmp({
  tagName: 'ion-breadcrumbs',
  customElement: undefined,
  inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode']
})
@Component({
  selector: 'ion-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode']
})
export class IonBreadcrumbs {
  /**
   * Emitted when the collapsed indicator is clicked on. 
   */
  @Output() ionCollapsedClick = new EventEmitter<CustomEvent<IBreadcrumbsBreadcrumbCollapsedClickEventDetail>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonButton extends Components.IonButton {}

@ProxyCmp({
  tagName: 'ion-button',
  customElement: undefined,
  inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type']
})
@Component({
  selector: 'ion-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type']
})
export class IonButton {
  /**
   * Emitted when the button has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the button loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonButtons extends Components.IonButtons {}

@ProxyCmp({
  tagName: 'ion-buttons',
  customElement: undefined,
  inputs: ['collapse']
})
@Component({
  selector: 'ion-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['collapse']
})
export class IonButtons {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonCard extends Components.IonCard {}

@ProxyCmp({
  tagName: 'ion-card',
  customElement: undefined,
  inputs: ['button', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type']
})
@Component({
  selector: 'ion-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['button', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type']
})
export class IonCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonCardContent extends Components.IonCardContent {}

@ProxyCmp({
  tagName: 'ion-card-content',
  customElement: undefined,
  inputs: ['mode']
})
@Component({
  selector: 'ion-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['mode']
})
export class IonCardContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonCardHeader extends Components.IonCardHeader {}

@ProxyCmp({
  tagName: 'ion-card-header',
  customElement: undefined,
  inputs: ['color', 'mode', 'translucent']
})
@Component({
  selector: 'ion-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode', 'translucent']
})
export class IonCardHeader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonCardSubtitle extends Components.IonCardSubtitle {}

@ProxyCmp({
  tagName: 'ion-card-subtitle',
  customElement: undefined,
  inputs: ['color', 'mode']
})
@Component({
  selector: 'ion-card-subtitle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode']
})
export class IonCardSubtitle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonCardTitle extends Components.IonCardTitle {}

@ProxyCmp({
  tagName: 'ion-card-title',
  customElement: undefined,
  inputs: ['color', 'mode']
})
@Component({
  selector: 'ion-card-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode']
})
export class IonCardTitle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { CheckboxChangeEventDetail as ICheckboxCheckboxChangeEventDetail } from '@ionic/core';
export declare interface IonCheckbox extends Components.IonCheckbox {}

@ProxyCmp({
  tagName: 'ion-checkbox',
  customElement: undefined,
  inputs: ['checked', 'color', 'disabled', 'indeterminate', 'mode', 'name', 'value']
})
@Component({
  selector: 'ion-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'color', 'disabled', 'indeterminate', 'mode', 'name', 'value']
})
export class IonCheckbox {
  /**
   * Emitted when the checked property has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<ICheckboxCheckboxChangeEventDetail>>();
  /**
   * Emitted when the checkbox has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the checkbox loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonChip extends Components.IonChip {}

@ProxyCmp({
  tagName: 'ion-chip',
  customElement: undefined,
  inputs: ['color', 'disabled', 'mode', 'outline']
})
@Component({
  selector: 'ion-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'disabled', 'mode', 'outline']
})
export class IonChip {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonCol extends Components.IonCol {}

@ProxyCmp({
  tagName: 'ion-col',
  customElement: undefined,
  inputs: ['offset', 'offsetLg', 'offsetMd', 'offsetSm', 'offsetXl', 'offsetXs', 'pull', 'pullLg', 'pullMd', 'pullSm', 'pullXl', 'pullXs', 'push', 'pushLg', 'pushMd', 'pushSm', 'pushXl', 'pushXs', 'size', 'sizeLg', 'sizeMd', 'sizeSm', 'sizeXl', 'sizeXs']
})
@Component({
  selector: 'ion-col',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['offset', 'offsetLg', 'offsetMd', 'offsetSm', 'offsetXl', 'offsetXs', 'pull', 'pullLg', 'pullMd', 'pullSm', 'pullXl', 'pullXs', 'push', 'pushLg', 'pushMd', 'pushSm', 'pushXl', 'pushXs', 'size', 'sizeLg', 'sizeMd', 'sizeSm', 'sizeXl', 'sizeXs']
})
export class IonCol {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { ScrollBaseDetail as IContentScrollBaseDetail } from '@ionic/core';
import type { ScrollDetail as IContentScrollDetail } from '@ionic/core';
export declare interface IonContent extends Components.IonContent {}

@ProxyCmp({
  tagName: 'ion-content',
  customElement: undefined,
  inputs: ['color', 'forceOverscroll', 'fullscreen', 'scrollEvents', 'scrollX', 'scrollY'],
  methods: ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']
})
@Component({
  selector: 'ion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'forceOverscroll', 'fullscreen', 'scrollEvents', 'scrollX', 'scrollY']
})
export class IonContent {
  /**
   * Emitted when the scroll has started. 
   */
  @Output() ionScrollStart = new EventEmitter<CustomEvent<IContentScrollBaseDetail>>();
  /**
   * Emitted while scrolling. This event is disabled by default.
Look at the property: `scrollEvents` 
   */
  @Output() ionScroll = new EventEmitter<CustomEvent<IContentScrollDetail>>();
  /**
   * Emitted when the scroll has ended. 
   */
  @Output() ionScrollEnd = new EventEmitter<CustomEvent<IContentScrollBaseDetail>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { DatetimeChangeEventDetail as IDatetimeDatetimeChangeEventDetail } from '@ionic/core';
export declare interface IonDatetime extends Components.IonDatetime {}

@ProxyCmp({
  tagName: 'ion-datetime',
  customElement: undefined,
  inputs: ['cancelText', 'clearText', 'color', 'dayValues', 'disabled', 'doneText', 'firstDayOfWeek', 'hourCycle', 'hourValues', 'locale', 'max', 'min', 'minuteValues', 'mode', 'monthValues', 'name', 'presentation', 'readonly', 'showClearButton', 'showDefaultButtons', 'showDefaultTimeLabel', 'showDefaultTitle', 'size', 'value', 'yearValues'],
  methods: ['confirm', 'reset', 'cancel']
})
@Component({
  selector: 'ion-datetime',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['cancelText', 'clearText', 'color', 'dayValues', 'disabled', 'doneText', 'firstDayOfWeek', 'hourCycle', 'hourValues', 'locale', 'max', 'min', 'minuteValues', 'mode', 'monthValues', 'name', 'presentation', 'readonly', 'showClearButton', 'showDefaultButtons', 'showDefaultTimeLabel', 'showDefaultTitle', 'size', 'value', 'yearValues']
})
export class IonDatetime {
  /**
   * Emitted when the datetime selection was cancelled. 
   */
  @Output() ionCancel = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the value (selected date) has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<IDatetimeDatetimeChangeEventDetail>>();
  /**
   * Emitted when the datetime has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the datetime loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonFab extends Components.IonFab {}

@ProxyCmp({
  tagName: 'ion-fab',
  customElement: undefined,
  inputs: ['activated', 'edge', 'horizontal', 'vertical'],
  methods: ['close']
})
@Component({
  selector: 'ion-fab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activated', 'edge', 'horizontal', 'vertical']
})
export class IonFab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonFabButton extends Components.IonFabButton {}

@ProxyCmp({
  tagName: 'ion-fab-button',
  customElement: undefined,
  inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type']
})
@Component({
  selector: 'ion-fab-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type']
})
export class IonFabButton {
  /**
   * Emitted when the button has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the button loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonFabList extends Components.IonFabList {}

@ProxyCmp({
  tagName: 'ion-fab-list',
  customElement: undefined,
  inputs: ['activated', 'side']
})
@Component({
  selector: 'ion-fab-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activated', 'side']
})
export class IonFabList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonFooter extends Components.IonFooter {}

@ProxyCmp({
  tagName: 'ion-footer',
  customElement: undefined,
  inputs: ['collapse', 'mode', 'translucent']
})
@Component({
  selector: 'ion-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['collapse', 'mode', 'translucent']
})
export class IonFooter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonGrid extends Components.IonGrid {}

@ProxyCmp({
  tagName: 'ion-grid',
  customElement: undefined,
  inputs: ['fixed']
})
@Component({
  selector: 'ion-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['fixed']
})
export class IonGrid {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonHeader extends Components.IonHeader {}

@ProxyCmp({
  tagName: 'ion-header',
  customElement: undefined,
  inputs: ['collapse', 'mode', 'translucent']
})
@Component({
  selector: 'ion-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['collapse', 'mode', 'translucent']
})
export class IonHeader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonIcon extends Components.IonIcon {}

@ProxyCmp({
  tagName: 'ion-icon',
  customElement: undefined,
  inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
@Component({
  selector: 'ion-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
})
export class IonIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonImg extends Components.IonImg {}

@ProxyCmp({
  tagName: 'ion-img',
  customElement: undefined,
  inputs: ['alt', 'src']
})
@Component({
  selector: 'ion-img',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alt', 'src']
})
export class IonImg {
  /**
   * Emitted when the img src has been set 
   */
  @Output() ionImgWillLoad = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the image has finished loading 
   */
  @Output() ionImgDidLoad = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the img fails to load 
   */
  @Output() ionError = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonInfiniteScroll extends Components.IonInfiniteScroll {}

@ProxyCmp({
  tagName: 'ion-infinite-scroll',
  customElement: undefined,
  inputs: ['disabled', 'position', 'threshold'],
  methods: ['complete']
})
@Component({
  selector: 'ion-infinite-scroll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'position', 'threshold']
})
export class IonInfiniteScroll {
  /**
   * Emitted when the scroll reaches
the threshold distance. From within your infinite handler,
you must call the infinite scroll's `complete()` method when
your async operation has completed. 
   */
  @Output() ionInfinite = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonInfiniteScrollContent extends Components.IonInfiniteScrollContent {}

@ProxyCmp({
  tagName: 'ion-infinite-scroll-content',
  customElement: undefined,
  inputs: ['loadingSpinner', 'loadingText']
})
@Component({
  selector: 'ion-infinite-scroll-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['loadingSpinner', 'loadingText']
})
export class IonInfiniteScrollContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { InputChangeEventDetail as IInputInputChangeEventDetail } from '@ionic/core';
export declare interface IonInput extends Components.IonInput {}

@ProxyCmp({
  tagName: 'ion-input',
  customElement: undefined,
  inputs: ['accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'color', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'mode', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'spellcheck', 'step', 'type', 'value'],
  methods: ['setFocus', 'getInputElement']
})
@Component({
  selector: 'ion-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'color', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'mode', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'spellcheck', 'step', 'type', 'value']
})
export class IonInput {
  /**
   * Emitted when a keyboard input occurred. 
   */
  @Output() ionInput = new EventEmitter<CustomEvent<InputEvent>>();
  /**
   * Emitted when the value has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<IInputInputChangeEventDetail>>();
  /**
   * Emitted when the input loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<FocusEvent>>();
  /**
   * Emitted when the input has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<FocusEvent>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItem extends Components.IonItem {}

@ProxyCmp({
  tagName: 'ion-item',
  customElement: undefined,
  inputs: ['button', 'color', 'counter', 'detail', 'detailIcon', 'disabled', 'download', 'fill', 'href', 'lines', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'target', 'type']
})
@Component({
  selector: 'ion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['button', 'color', 'counter', 'detail', 'detailIcon', 'disabled', 'download', 'fill', 'href', 'lines', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'target', 'type']
})
export class IonItem {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItemDivider extends Components.IonItemDivider {}

@ProxyCmp({
  tagName: 'ion-item-divider',
  customElement: undefined,
  inputs: ['color', 'mode', 'sticky']
})
@Component({
  selector: 'ion-item-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode', 'sticky']
})
export class IonItemDivider {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItemGroup extends Components.IonItemGroup {}

@ProxyCmp({
  tagName: 'ion-item-group',
  customElement: undefined
})
@Component({
  selector: 'ion-item-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonItemGroup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItemOption extends Components.IonItemOption {}

@ProxyCmp({
  tagName: 'ion-item-option',
  customElement: undefined,
  inputs: ['color', 'disabled', 'download', 'expandable', 'href', 'mode', 'rel', 'target', 'type']
})
@Component({
  selector: 'ion-item-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'disabled', 'download', 'expandable', 'href', 'mode', 'rel', 'target', 'type']
})
export class IonItemOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItemOptions extends Components.IonItemOptions {}

@ProxyCmp({
  tagName: 'ion-item-options',
  customElement: undefined,
  inputs: ['side']
})
@Component({
  selector: 'ion-item-options',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['side']
})
export class IonItemOptions {
  /**
   * Emitted when the item has been fully swiped. 
   */
  @Output() ionSwipe = new EventEmitter<CustomEvent<any>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItemSliding extends Components.IonItemSliding {}

@ProxyCmp({
  tagName: 'ion-item-sliding',
  customElement: undefined,
  inputs: ['disabled'],
  methods: ['getOpenAmount', 'getSlidingRatio', 'open', 'close', 'closeOpened']
})
@Component({
  selector: 'ion-item-sliding',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled']
})
export class IonItemSliding {
  /**
   * Emitted when the sliding position changes. 
   */
  @Output() ionDrag = new EventEmitter<CustomEvent<any>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonLabel extends Components.IonLabel {}

@ProxyCmp({
  tagName: 'ion-label',
  customElement: undefined,
  inputs: ['color', 'mode', 'position']
})
@Component({
  selector: 'ion-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode', 'position']
})
export class IonLabel {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonList extends Components.IonList {}

@ProxyCmp({
  tagName: 'ion-list',
  customElement: undefined,
  inputs: ['inset', 'lines', 'mode'],
  methods: ['closeSlidingItems']
})
@Component({
  selector: 'ion-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['inset', 'lines', 'mode']
})
export class IonList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonListHeader extends Components.IonListHeader {}

@ProxyCmp({
  tagName: 'ion-list-header',
  customElement: undefined,
  inputs: ['color', 'lines', 'mode']
})
@Component({
  selector: 'ion-list-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'lines', 'mode']
})
export class IonListHeader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonMenu extends Components.IonMenu {}

@ProxyCmp({
  tagName: 'ion-menu',
  customElement: undefined,
  inputs: ['contentId', 'disabled', 'maxEdgeStart', 'menuId', 'side', 'swipeGesture', 'type'],
  methods: ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']
})
@Component({
  selector: 'ion-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['contentId', 'disabled', 'maxEdgeStart', 'menuId', 'side', 'swipeGesture', 'type']
})
export class IonMenu {
  /**
   * Emitted when the menu is about to be opened. 
   */
  @Output() ionWillOpen = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the menu is about to be closed. 
   */
  @Output() ionWillClose = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the menu is open. 
   */
  @Output() ionDidOpen = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the menu is closed. 
   */
  @Output() ionDidClose = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonMenuButton extends Components.IonMenuButton {}

@ProxyCmp({
  tagName: 'ion-menu-button',
  customElement: undefined,
  inputs: ['autoHide', 'color', 'disabled', 'menu', 'mode', 'type']
})
@Component({
  selector: 'ion-menu-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoHide', 'color', 'disabled', 'menu', 'mode', 'type']
})
export class IonMenuButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonMenuToggle extends Components.IonMenuToggle {}

@ProxyCmp({
  tagName: 'ion-menu-toggle',
  customElement: undefined,
  inputs: ['autoHide', 'menu']
})
@Component({
  selector: 'ion-menu-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoHide', 'menu']
})
export class IonMenuToggle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonNav extends Components.IonNav {}

@ProxyCmp({
  tagName: 'ion-nav',
  customElement: undefined,
  inputs: ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'],
  methods: ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']
})
@Component({
  selector: 'ion-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animated', 'animation', 'root', 'rootParams', 'swipeGesture']
})
export class IonNav {
  /**
   * Event fired when the nav will change components 
   */
  @Output() ionNavWillChange = new EventEmitter<CustomEvent<void>>();
  /**
   * Event fired when the nav has changed components 
   */
  @Output() ionNavDidChange = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonNavLink extends Components.IonNavLink {}

@ProxyCmp({
  tagName: 'ion-nav-link',
  customElement: undefined,
  inputs: ['component', 'componentProps', 'routerAnimation', 'routerDirection']
})
@Component({
  selector: 'ion-nav-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['component', 'componentProps', 'routerAnimation', 'routerDirection']
})
export class IonNavLink {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonNote extends Components.IonNote {}

@ProxyCmp({
  tagName: 'ion-note',
  customElement: undefined,
  inputs: ['color', 'mode']
})
@Component({
  selector: 'ion-note',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode']
})
export class IonNote {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonProgressBar extends Components.IonProgressBar {}

@ProxyCmp({
  tagName: 'ion-progress-bar',
  customElement: undefined,
  inputs: ['buffer', 'color', 'mode', 'reversed', 'type', 'value']
})
@Component({
  selector: 'ion-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buffer', 'color', 'mode', 'reversed', 'type', 'value']
})
export class IonProgressBar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonRadio extends Components.IonRadio {}

@ProxyCmp({
  tagName: 'ion-radio',
  customElement: undefined,
  inputs: ['color', 'disabled', 'mode', 'name', 'value']
})
@Component({
  selector: 'ion-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'disabled', 'mode', 'name', 'value']
})
export class IonRadio {
  /**
   * Emitted when the radio button has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the radio button loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { RadioGroupChangeEventDetail as IRadioGroupRadioGroupChangeEventDetail } from '@ionic/core';
export declare interface IonRadioGroup extends Components.IonRadioGroup {}

@ProxyCmp({
  tagName: 'ion-radio-group',
  customElement: undefined,
  inputs: ['allowEmptySelection', 'name', 'value']
})
@Component({
  selector: 'ion-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['allowEmptySelection', 'name', 'value']
})
export class IonRadioGroup {
  /**
   * Emitted when the value has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<IRadioGroupRadioGroupChangeEventDetail>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { RangeChangeEventDetail as IRangeRangeChangeEventDetail } from '@ionic/core';
export declare interface IonRange extends Components.IonRange {}

@ProxyCmp({
  tagName: 'ion-range',
  customElement: undefined,
  inputs: ['color', 'debounce', 'disabled', 'dualKnobs', 'max', 'min', 'mode', 'name', 'pin', 'pinFormatter', 'snaps', 'step', 'ticks', 'value']
})
@Component({
  selector: 'ion-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'debounce', 'disabled', 'dualKnobs', 'max', 'min', 'mode', 'name', 'pin', 'pinFormatter', 'snaps', 'step', 'ticks', 'value']
})
export class IonRange {
  /**
   * Emitted when the value property has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<IRangeRangeChangeEventDetail>>();
  /**
   * Emitted when the range has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the range loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { RefresherEventDetail as IRefresherRefresherEventDetail } from '@ionic/core';
export declare interface IonRefresher extends Components.IonRefresher {}

@ProxyCmp({
  tagName: 'ion-refresher',
  customElement: undefined,
  inputs: ['closeDuration', 'disabled', 'pullFactor', 'pullMax', 'pullMin', 'snapbackDuration'],
  methods: ['complete', 'cancel', 'getProgress']
})
@Component({
  selector: 'ion-refresher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['closeDuration', 'disabled', 'pullFactor', 'pullMax', 'pullMin', 'snapbackDuration']
})
export class IonRefresher {
  /**
   * Emitted when the user lets go of the content and has pulled down
further than the `pullMin` or pulls the content down and exceeds the pullMax.
Updates the refresher state to `refreshing`. The `complete()` method should be
called when the async operation has completed. 
   */
  @Output() ionRefresh = new EventEmitter<CustomEvent<IRefresherRefresherEventDetail>>();
  /**
   * Emitted while the user is pulling down the content and exposing the refresher. 
   */
  @Output() ionPull = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the user begins to start pulling down. 
   */
  @Output() ionStart = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonRefresherContent extends Components.IonRefresherContent {}

@ProxyCmp({
  tagName: 'ion-refresher-content',
  customElement: undefined,
  inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']
})
@Component({
  selector: 'ion-refresher-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']
})
export class IonRefresherContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonReorder extends Components.IonReorder {}

@ProxyCmp({
  tagName: 'ion-reorder',
  customElement: undefined
})
@Component({
  selector: 'ion-reorder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonReorder {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { ItemReorderEventDetail as IReorderGroupItemReorderEventDetail } from '@ionic/core';
export declare interface IonReorderGroup extends Components.IonReorderGroup {}

@ProxyCmp({
  tagName: 'ion-reorder-group',
  customElement: undefined,
  inputs: ['disabled'],
  methods: ['complete']
})
@Component({
  selector: 'ion-reorder-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled']
})
export class IonReorderGroup {
  /**
   * Event that needs to be listened to in order to complete the reorder action.
Once the event has been emitted, the `complete()` method then needs
to be called in order to finalize the reorder action. 
   */
  @Output() ionItemReorder = new EventEmitter<CustomEvent<IReorderGroupItemReorderEventDetail>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonRippleEffect extends Components.IonRippleEffect {}

@ProxyCmp({
  tagName: 'ion-ripple-effect',
  customElement: undefined,
  inputs: ['type'],
  methods: ['addRipple']
})
@Component({
  selector: 'ion-ripple-effect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['type']
})
export class IonRippleEffect {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonRow extends Components.IonRow {}

@ProxyCmp({
  tagName: 'ion-row',
  customElement: undefined
})
@Component({
  selector: 'ion-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonRow {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { SearchbarChangeEventDetail as ISearchbarSearchbarChangeEventDetail } from '@ionic/core';
export declare interface IonSearchbar extends Components.IonSearchbar {}

@ProxyCmp({
  tagName: 'ion-searchbar',
  customElement: undefined,
  inputs: ['animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'color', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'mode', 'placeholder', 'searchIcon', 'showCancelButton', 'showClearButton', 'spellcheck', 'type', 'value'],
  methods: ['setFocus', 'getInputElement']
})
@Component({
  selector: 'ion-searchbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'color', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'mode', 'placeholder', 'searchIcon', 'showCancelButton', 'showClearButton', 'spellcheck', 'type', 'value']
})
export class IonSearchbar {
  /**
   * Emitted when a keyboard input occurred. 
   */
  @Output() ionInput = new EventEmitter<CustomEvent<KeyboardEvent>>();
  /**
   * Emitted when the value has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<ISearchbarSearchbarChangeEventDetail>>();
  /**
   * Emitted when the cancel button is clicked. 
   */
  @Output() ionCancel = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the clear input button is clicked. 
   */
  @Output() ionClear = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the input loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the input has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { SegmentChangeEventDetail as ISegmentSegmentChangeEventDetail } from '@ionic/core';
export declare interface IonSegment extends Components.IonSegment {}

@ProxyCmp({
  tagName: 'ion-segment',
  customElement: undefined,
  inputs: ['color', 'disabled', 'mode', 'scrollable', 'selectOnFocus', 'swipeGesture', 'value']
})
@Component({
  selector: 'ion-segment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'disabled', 'mode', 'scrollable', 'selectOnFocus', 'swipeGesture', 'value']
})
export class IonSegment {
  /**
   * Emitted when the value property has changed and any
dragging pointer has been released from `ion-segment`. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<ISegmentSegmentChangeEventDetail>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSegmentButton extends Components.IonSegmentButton {}

@ProxyCmp({
  tagName: 'ion-segment-button',
  customElement: undefined,
  inputs: ['disabled', 'layout', 'mode', 'type', 'value']
})
@Component({
  selector: 'ion-segment-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'layout', 'mode', 'type', 'value']
})
export class IonSegmentButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { SelectChangeEventDetail as ISelectSelectChangeEventDetail } from '@ionic/core';
export declare interface IonSelect extends Components.IonSelect {}

@ProxyCmp({
  tagName: 'ion-select',
  customElement: undefined,
  inputs: ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'selectedText', 'value'],
  methods: ['open']
})
@Component({
  selector: 'ion-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'selectedText', 'value']
})
export class IonSelect {
  /**
   * Emitted when the value has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<ISelectSelectChangeEventDetail>>();
  /**
   * Emitted when the selection is cancelled. 
   */
  @Output() ionCancel = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the select has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the select loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSelectOption extends Components.IonSelectOption {}

@ProxyCmp({
  tagName: 'ion-select-option',
  customElement: undefined,
  inputs: ['disabled', 'value']
})
@Component({
  selector: 'ion-select-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'value']
})
export class IonSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSkeletonText extends Components.IonSkeletonText {}

@ProxyCmp({
  tagName: 'ion-skeleton-text',
  customElement: undefined,
  inputs: ['animated']
})
@Component({
  selector: 'ion-skeleton-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['animated']
})
export class IonSkeletonText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSlide extends Components.IonSlide {}

@ProxyCmp({
  tagName: 'ion-slide',
  customElement: undefined
})
@Component({
  selector: 'ion-slide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonSlide {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSlides extends Components.IonSlides {}

@ProxyCmp({
  tagName: 'ion-slides',
  customElement: undefined,
  inputs: ['mode', 'options', 'pager', 'scrollbar'],
  methods: ['update', 'updateAutoHeight', 'slideTo', 'slideNext', 'slidePrev', 'getActiveIndex', 'getPreviousIndex', 'length', 'isEnd', 'isBeginning', 'startAutoplay', 'stopAutoplay', 'lockSwipeToNext', 'lockSwipeToPrev', 'lockSwipes', 'getSwiper']
})
@Component({
  selector: 'ion-slides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['mode', 'options', 'pager', 'scrollbar']
})
export class IonSlides {
  /**
   * Emitted after Swiper initialization 
   */
  @Output() ionSlidesDidLoad = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the user taps/clicks on the slide's container. 
   */
  @Output() ionSlideTap = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the user double taps on the slide's container. 
   */
  @Output() ionSlideDoubleTap = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted before the active slide has changed. 
   */
  @Output() ionSlideWillChange = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted after the active slide has changed. 
   */
  @Output() ionSlideDidChange = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the next slide has started. 
   */
  @Output() ionSlideNextStart = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the previous slide has started. 
   */
  @Output() ionSlidePrevStart = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the next slide has ended. 
   */
  @Output() ionSlideNextEnd = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the previous slide has ended. 
   */
  @Output() ionSlidePrevEnd = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the slide transition has started. 
   */
  @Output() ionSlideTransitionStart = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the slide transition has ended. 
   */
  @Output() ionSlideTransitionEnd = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the slider is actively being moved. 
   */
  @Output() ionSlideDrag = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the slider is at its initial position. 
   */
  @Output() ionSlideReachStart = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the slider is at the last slide. 
   */
  @Output() ionSlideReachEnd = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the user first touches the slider. 
   */
  @Output() ionSlideTouchStart = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the user releases the touch. 
   */
  @Output() ionSlideTouchEnd = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSpinner extends Components.IonSpinner {}

@ProxyCmp({
  tagName: 'ion-spinner',
  customElement: undefined,
  inputs: ['color', 'duration', 'name', 'paused']
})
@Component({
  selector: 'ion-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'duration', 'name', 'paused']
})
export class IonSpinner {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSplitPane extends Components.IonSplitPane {}

@ProxyCmp({
  tagName: 'ion-split-pane',
  customElement: undefined,
  inputs: ['contentId', 'disabled', 'when']
})
@Component({
  selector: 'ion-split-pane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['contentId', 'disabled', 'when']
})
export class IonSplitPane {
  /**
   * Expression to be called when the split-pane visibility has changed 
   */
  @Output() ionSplitPaneVisible = new EventEmitter<CustomEvent<{visible: boolean}>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTabBar extends Components.IonTabBar {}

@ProxyCmp({
  tagName: 'ion-tab-bar',
  customElement: undefined,
  inputs: ['color', 'mode', 'selectedTab', 'translucent']
})
@Component({
  selector: 'ion-tab-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode', 'selectedTab', 'translucent']
})
export class IonTabBar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTabButton extends Components.IonTabButton {}

@ProxyCmp({
  tagName: 'ion-tab-button',
  customElement: undefined,
  inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target']
})
@Component({
  selector: 'ion-tab-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target']
})
export class IonTabButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonText extends Components.IonText {}

@ProxyCmp({
  tagName: 'ion-text',
  customElement: undefined,
  inputs: ['color', 'mode']
})
@Component({
  selector: 'ion-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode']
})
export class IonText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { TextareaChangeEventDetail as ITextareaTextareaChangeEventDetail } from '@ionic/core';
export declare interface IonTextarea extends Components.IonTextarea {}

@ProxyCmp({
  tagName: 'ion-textarea',
  customElement: undefined,
  inputs: ['autoGrow', 'autocapitalize', 'autofocus', 'clearOnEdit', 'color', 'cols', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'maxlength', 'minlength', 'mode', 'name', 'placeholder', 'readonly', 'required', 'rows', 'spellcheck', 'value', 'wrap'],
  methods: ['setFocus', 'getInputElement']
})
@Component({
  selector: 'ion-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoGrow', 'autocapitalize', 'autofocus', 'clearOnEdit', 'color', 'cols', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'maxlength', 'minlength', 'mode', 'name', 'placeholder', 'readonly', 'required', 'rows', 'spellcheck', 'value', 'wrap']
})
export class IonTextarea {
  /**
   * Emitted when the input value has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<ITextareaTextareaChangeEventDetail>>();
  /**
   * Emitted when a keyboard input occurred. 
   */
  @Output() ionInput = new EventEmitter<CustomEvent<InputEvent>>();
  /**
   * Emitted when the input loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<FocusEvent>>();
  /**
   * Emitted when the input has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<FocusEvent>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonThumbnail extends Components.IonThumbnail {}

@ProxyCmp({
  tagName: 'ion-thumbnail',
  customElement: undefined
})
@Component({
  selector: 'ion-thumbnail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class IonThumbnail {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTitle extends Components.IonTitle {}

@ProxyCmp({
  tagName: 'ion-title',
  customElement: undefined,
  inputs: ['color', 'size']
})
@Component({
  selector: 'ion-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'size']
})
export class IonTitle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { ToggleChangeEventDetail as IToggleToggleChangeEventDetail } from '@ionic/core';
export declare interface IonToggle extends Components.IonToggle {}

@ProxyCmp({
  tagName: 'ion-toggle',
  customElement: undefined,
  inputs: ['checked', 'color', 'disabled', 'mode', 'name', 'value']
})
@Component({
  selector: 'ion-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'color', 'disabled', 'mode', 'name', 'value']
})
export class IonToggle {
  /**
   * Emitted when the value property has changed. 
   */
  @Output() ionChange = new EventEmitter<CustomEvent<IToggleToggleChangeEventDetail>>();
  /**
   * Emitted when the toggle has focus. 
   */
  @Output() ionFocus = new EventEmitter<CustomEvent<void>>();
  /**
   * Emitted when the toggle loses focus. 
   */
  @Output() ionBlur = new EventEmitter<CustomEvent<void>>();


  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonToolbar extends Components.IonToolbar {}

@ProxyCmp({
  tagName: 'ion-toolbar',
  customElement: undefined,
  inputs: ['color', 'mode']
})
@Component({
  selector: 'ion-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'mode']
})
export class IonToolbar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
