/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import Vue, { PropOptions } from 'vue';
import { createCommonRender, createCommonMethod } from './vue-component-lib/utils';

import { Components } from '@ionic/core';




const customElementTags: string[] = [
 'ion-action-sheet',
 'ion-alert',
 'ion-app',
 'ion-avatar',
 'ion-back-button',
 'ion-backdrop',
 'ion-badge',
 'ion-button',
 'ion-buttons',
 'ion-card',
 'ion-card-content',
 'ion-card-header',
 'ion-card-subtitle',
 'ion-card-title',
 'ion-checkbox',
 'ion-chip',
 'ion-col',
 'ion-content',
 'ion-datetime',
 'ion-fab',
 'ion-fab-button',
 'ion-fab-list',
 'ion-footer',
 'ion-grid',
 'ion-header',
 'ion-icon',
 'ion-img',
 'ion-infinite-scroll',
 'ion-infinite-scroll-content',
 'ion-input',
 'ion-item',
 'ion-item-divider',
 'ion-item-group',
 'ion-item-option',
 'ion-item-options',
 'ion-item-sliding',
 'ion-label',
 'ion-list',
 'ion-list-header',
 'ion-loading',
 'ion-menu',
 'ion-menu-button',
 'ion-menu-toggle',
 'ion-modal',
 'ion-nav',
 'ion-nav-link',
 'ion-note',
 'ion-picker',
 'ion-popover',
 'ion-progress-bar',
 'ion-radio',
 'ion-radio-group',
 'ion-range',
 'ion-refresher',
 'ion-refresher-content',
 'ion-reorder',
 'ion-reorder-group',
 'ion-ripple-effect',
 'ion-route',
 'ion-route-redirect',
 'ion-router',
 'ion-router-link',
 'ion-router-outlet',
 'ion-row',
 'ion-searchbar',
 'ion-segment',
 'ion-segment-button',
 'ion-select',
 'ion-select-option',
 'ion-skeleton-text',
 'ion-slide',
 'ion-slides',
 'ion-spinner',
 'ion-split-pane',
 'ion-tab',
 'ion-tab-bar',
 'ion-tab-button',
 'ion-tabs',
 'ion-text',
 'ion-textarea',
 'ion-thumbnail',
 'ion-title',
 'ion-toast',
 'ion-toggle',
 'ion-toolbar',
 'ion-virtual-scroll',
];
Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...customElementTags];


export const IonActionSheet = /*@__PURE__*/ Vue.extend({

  props: {
    overlayIndex: {} as PropOptions<Components.IonActionSheet['overlayIndex']>,
    keyboardClose: {} as PropOptions<Components.IonActionSheet['keyboardClose']>,
    enterAnimation: {} as PropOptions<Components.IonActionSheet['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonActionSheet['leaveAnimation']>,
    buttons: {} as PropOptions<Components.IonActionSheet['buttons']>,
    cssClass: {} as PropOptions<Components.IonActionSheet['cssClass']>,
    backdropDismiss: {} as PropOptions<Components.IonActionSheet['backdropDismiss']>,
    header: {} as PropOptions<Components.IonActionSheet['header']>,
    subHeader: {} as PropOptions<Components.IonActionSheet['subHeader']>,
    translucent: {} as PropOptions<Components.IonActionSheet['translucent']>,
    animated: {} as PropOptions<Components.IonActionSheet['animated']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonActionSheet['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonActionSheet['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonActionSheet['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonActionSheet['onWillDismiss'],
  },
  render: createCommonRender('ion-action-sheet', ['ionActionSheetDidPresent', 'ionActionSheetWillPresent', 'ionActionSheetWillDismiss', 'ionActionSheetDidDismiss']),
});


export const IonAlert = /*@__PURE__*/ Vue.extend({

  props: {
    overlayIndex: {} as PropOptions<Components.IonAlert['overlayIndex']>,
    keyboardClose: {} as PropOptions<Components.IonAlert['keyboardClose']>,
    enterAnimation: {} as PropOptions<Components.IonAlert['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonAlert['leaveAnimation']>,
    cssClass: {} as PropOptions<Components.IonAlert['cssClass']>,
    header: {} as PropOptions<Components.IonAlert['header']>,
    subHeader: {} as PropOptions<Components.IonAlert['subHeader']>,
    message: {} as PropOptions<Components.IonAlert['message']>,
    buttons: {} as PropOptions<Components.IonAlert['buttons']>,
    inputs: {} as PropOptions<Components.IonAlert['inputs']>,
    backdropDismiss: {} as PropOptions<Components.IonAlert['backdropDismiss']>,
    translucent: {} as PropOptions<Components.IonAlert['translucent']>,
    animated: {} as PropOptions<Components.IonAlert['animated']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonAlert['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonAlert['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonAlert['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonAlert['onWillDismiss'],
  },
  render: createCommonRender('ion-alert', ['ionAlertDidPresent', 'ionAlertWillPresent', 'ionAlertWillDismiss', 'ionAlertDidDismiss']),
});


export const IonApp = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-app', []),
});


export const IonAvatar = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-avatar', []),
});


export const IonBackButton = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonBackButton['color']>,
    defaultHref: {} as PropOptions<Components.IonBackButton['defaultHref']>,
    disabled: {} as PropOptions<Components.IonBackButton['disabled']>,
    icon: {} as PropOptions<Components.IonBackButton['icon']>,
    text: {} as PropOptions<Components.IonBackButton['text']>,
    type: {} as PropOptions<Components.IonBackButton['type']>,
    routerAnimation: {} as PropOptions<Components.IonBackButton['routerAnimation']>,
  },


  render: createCommonRender('ion-back-button', []),
});


export const IonBackdrop = /*@__PURE__*/ Vue.extend({

  props: {
    visible: {} as PropOptions<Components.IonBackdrop['visible']>,
    tappable: {} as PropOptions<Components.IonBackdrop['tappable']>,
    stopPropagation: {} as PropOptions<Components.IonBackdrop['stopPropagation']>,
  },


  render: createCommonRender('ion-backdrop', ['ionBackdropTap']),
});


export const IonBadge = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonBadge['color']>,
  },


  render: createCommonRender('ion-badge', []),
});


export const IonButton = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonButton['color']>,
    buttonType: {} as PropOptions<Components.IonButton['buttonType']>,
    disabled: {} as PropOptions<Components.IonButton['disabled']>,
    expand: {} as PropOptions<Components.IonButton['expand']>,
    fill: {} as PropOptions<Components.IonButton['fill']>,
    routerDirection: {} as PropOptions<Components.IonButton['routerDirection']>,
    routerAnimation: {} as PropOptions<Components.IonButton['routerAnimation']>,
    download: {} as PropOptions<Components.IonButton['download']>,
    href: {} as PropOptions<Components.IonButton['href']>,
    rel: {} as PropOptions<Components.IonButton['rel']>,
    shape: {} as PropOptions<Components.IonButton['shape']>,
    size: {} as PropOptions<Components.IonButton['size']>,
    strong: {} as PropOptions<Components.IonButton['strong']>,
    target: {} as PropOptions<Components.IonButton['target']>,
    type: {} as PropOptions<Components.IonButton['type']>,
  },


  render: createCommonRender('ion-button', ['ionFocus', 'ionBlur']),
});


export const IonButtons = /*@__PURE__*/ Vue.extend({

  props: {
    collapse: {} as PropOptions<Components.IonButtons['collapse']>,
  },


  render: createCommonRender('ion-buttons', []),
});


export const IonCard = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonCard['color']>,
    button: {} as PropOptions<Components.IonCard['button']>,
    type: {} as PropOptions<Components.IonCard['type']>,
    disabled: {} as PropOptions<Components.IonCard['disabled']>,
    download: {} as PropOptions<Components.IonCard['download']>,
    href: {} as PropOptions<Components.IonCard['href']>,
    rel: {} as PropOptions<Components.IonCard['rel']>,
    routerDirection: {} as PropOptions<Components.IonCard['routerDirection']>,
    routerAnimation: {} as PropOptions<Components.IonCard['routerAnimation']>,
    target: {} as PropOptions<Components.IonCard['target']>,
  },


  render: createCommonRender('ion-card', []),
});


export const IonCardContent = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-card-content', []),
});


export const IonCardHeader = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonCardHeader['color']>,
    translucent: {} as PropOptions<Components.IonCardHeader['translucent']>,
  },


  render: createCommonRender('ion-card-header', []),
});


export const IonCardSubtitle = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonCardSubtitle['color']>,
  },


  render: createCommonRender('ion-card-subtitle', []),
});


export const IonCardTitle = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonCardTitle['color']>,
  },


  render: createCommonRender('ion-card-title', []),
});


export const IonCheckbox = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonCheckbox['color']>,
    name: {} as PropOptions<Components.IonCheckbox['name']>,
    checked: {} as PropOptions<Components.IonCheckbox['checked']>,
    indeterminate: {} as PropOptions<Components.IonCheckbox['indeterminate']>,
    disabled: {} as PropOptions<Components.IonCheckbox['disabled']>,
    value: {} as PropOptions<Components.IonCheckbox['value']>,
  },


  render: createCommonRender('ion-checkbox', ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']),
});


export const IonChip = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonChip['color']>,
    outline: {} as PropOptions<Components.IonChip['outline']>,
  },


  render: createCommonRender('ion-chip', []),
});


export const IonCol = /*@__PURE__*/ Vue.extend({

  props: {
    offset: {} as PropOptions<Components.IonCol['offset']>,
    offsetXs: {} as PropOptions<Components.IonCol['offsetXs']>,
    offsetSm: {} as PropOptions<Components.IonCol['offsetSm']>,
    offsetMd: {} as PropOptions<Components.IonCol['offsetMd']>,
    offsetLg: {} as PropOptions<Components.IonCol['offsetLg']>,
    offsetXl: {} as PropOptions<Components.IonCol['offsetXl']>,
    pull: {} as PropOptions<Components.IonCol['pull']>,
    pullXs: {} as PropOptions<Components.IonCol['pullXs']>,
    pullSm: {} as PropOptions<Components.IonCol['pullSm']>,
    pullMd: {} as PropOptions<Components.IonCol['pullMd']>,
    pullLg: {} as PropOptions<Components.IonCol['pullLg']>,
    pullXl: {} as PropOptions<Components.IonCol['pullXl']>,
    push: {} as PropOptions<Components.IonCol['push']>,
    pushXs: {} as PropOptions<Components.IonCol['pushXs']>,
    pushSm: {} as PropOptions<Components.IonCol['pushSm']>,
    pushMd: {} as PropOptions<Components.IonCol['pushMd']>,
    pushLg: {} as PropOptions<Components.IonCol['pushLg']>,
    pushXl: {} as PropOptions<Components.IonCol['pushXl']>,
    size: {} as PropOptions<Components.IonCol['size']>,
    sizeXs: {} as PropOptions<Components.IonCol['sizeXs']>,
    sizeSm: {} as PropOptions<Components.IonCol['sizeSm']>,
    sizeMd: {} as PropOptions<Components.IonCol['sizeMd']>,
    sizeLg: {} as PropOptions<Components.IonCol['sizeLg']>,
    sizeXl: {} as PropOptions<Components.IonCol['sizeXl']>,
  },


  render: createCommonRender('ion-col', []),
});


export const IonContent = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonContent['color']>,
    fullscreen: {} as PropOptions<Components.IonContent['fullscreen']>,
    forceOverscroll: {} as PropOptions<Components.IonContent['forceOverscroll']>,
    scrollX: {} as PropOptions<Components.IonContent['scrollX']>,
    scrollY: {} as PropOptions<Components.IonContent['scrollY']>,
    scrollEvents: {} as PropOptions<Components.IonContent['scrollEvents']>,
  },


  methods: {
    getScrollElement: createCommonMethod('getScrollElement') as Components.IonContent['getScrollElement'],
    scrollToTop: createCommonMethod('scrollToTop') as Components.IonContent['scrollToTop'],
    scrollToBottom: createCommonMethod('scrollToBottom') as Components.IonContent['scrollToBottom'],
    scrollByPoint: createCommonMethod('scrollByPoint') as Components.IonContent['scrollByPoint'],
    scrollToPoint: createCommonMethod('scrollToPoint') as Components.IonContent['scrollToPoint'],
  },
  render: createCommonRender('ion-content', ['ionScrollStart', 'ionScroll', 'ionScrollEnd']),
});


export const IonDatetime = /*@__PURE__*/ Vue.extend({

  props: {
    name: {} as PropOptions<Components.IonDatetime['name']>,
    disabled: {} as PropOptions<Components.IonDatetime['disabled']>,
    readonly: {} as PropOptions<Components.IonDatetime['readonly']>,
    min: {} as PropOptions<Components.IonDatetime['min']>,
    max: {} as PropOptions<Components.IonDatetime['max']>,
    displayFormat: {} as PropOptions<Components.IonDatetime['displayFormat']>,
    displayTimezone: {} as PropOptions<Components.IonDatetime['displayTimezone']>,
    pickerFormat: {} as PropOptions<Components.IonDatetime['pickerFormat']>,
    cancelText: {} as PropOptions<Components.IonDatetime['cancelText']>,
    doneText: {} as PropOptions<Components.IonDatetime['doneText']>,
    yearValues: {} as PropOptions<Components.IonDatetime['yearValues']>,
    monthValues: {} as PropOptions<Components.IonDatetime['monthValues']>,
    dayValues: {} as PropOptions<Components.IonDatetime['dayValues']>,
    hourValues: {} as PropOptions<Components.IonDatetime['hourValues']>,
    minuteValues: {} as PropOptions<Components.IonDatetime['minuteValues']>,
    monthNames: {} as PropOptions<Components.IonDatetime['monthNames']>,
    monthShortNames: {} as PropOptions<Components.IonDatetime['monthShortNames']>,
    dayNames: {} as PropOptions<Components.IonDatetime['dayNames']>,
    dayShortNames: {} as PropOptions<Components.IonDatetime['dayShortNames']>,
    pickerOptions: {} as PropOptions<Components.IonDatetime['pickerOptions']>,
    placeholder: {} as PropOptions<Components.IonDatetime['placeholder']>,
    value: {} as PropOptions<Components.IonDatetime['value']>,
  },


  methods: {
    open: createCommonMethod('open') as Components.IonDatetime['open'],
  },
  render: createCommonRender('ion-datetime', ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur', 'ionStyle']),
});


export const IonFab = /*@__PURE__*/ Vue.extend({

  props: {
    horizontal: {} as PropOptions<Components.IonFab['horizontal']>,
    vertical: {} as PropOptions<Components.IonFab['vertical']>,
    edge: {} as PropOptions<Components.IonFab['edge']>,
    activated: {} as PropOptions<Components.IonFab['activated']>,
  },


  methods: {
    close: createCommonMethod('close') as Components.IonFab['close'],
  },
  render: createCommonRender('ion-fab', []),
});


export const IonFabButton = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonFabButton['color']>,
    activated: {} as PropOptions<Components.IonFabButton['activated']>,
    disabled: {} as PropOptions<Components.IonFabButton['disabled']>,
    download: {} as PropOptions<Components.IonFabButton['download']>,
    href: {} as PropOptions<Components.IonFabButton['href']>,
    rel: {} as PropOptions<Components.IonFabButton['rel']>,
    routerDirection: {} as PropOptions<Components.IonFabButton['routerDirection']>,
    routerAnimation: {} as PropOptions<Components.IonFabButton['routerAnimation']>,
    target: {} as PropOptions<Components.IonFabButton['target']>,
    show: {} as PropOptions<Components.IonFabButton['show']>,
    translucent: {} as PropOptions<Components.IonFabButton['translucent']>,
    type: {} as PropOptions<Components.IonFabButton['type']>,
    size: {} as PropOptions<Components.IonFabButton['size']>,
    closeIcon: {} as PropOptions<Components.IonFabButton['closeIcon']>,
  },


  render: createCommonRender('ion-fab-button', ['ionFocus', 'ionBlur']),
});


export const IonFabList = /*@__PURE__*/ Vue.extend({

  props: {
    activated: {} as PropOptions<Components.IonFabList['activated']>,
    side: {} as PropOptions<Components.IonFabList['side']>,
  },


  render: createCommonRender('ion-fab-list', []),
});


export const IonFooter = /*@__PURE__*/ Vue.extend({

  props: {
    translucent: {} as PropOptions<Components.IonFooter['translucent']>,
  },


  render: createCommonRender('ion-footer', []),
});


export const IonGrid = /*@__PURE__*/ Vue.extend({

  props: {
    fixed: {} as PropOptions<Components.IonGrid['fixed']>,
  },


  render: createCommonRender('ion-grid', []),
});


export const IonHeader = /*@__PURE__*/ Vue.extend({

  props: {
    collapse: {} as PropOptions<Components.IonHeader['collapse']>,
    translucent: {} as PropOptions<Components.IonHeader['translucent']>,
  },


  render: createCommonRender('ion-header', []),
});


export const IonIcon = /*@__PURE__*/ Vue.extend({

  props: {
    mode: {} as PropOptions<Components.IonIcon['mode']>,
    color: {} as PropOptions<Components.IonIcon['color']>,
    ariaLabel: {} as PropOptions<Components.IonIcon['ariaLabel']>,
    ios: {} as PropOptions<Components.IonIcon['ios']>,
    md: {} as PropOptions<Components.IonIcon['md']>,
    flipRtl: {} as PropOptions<Components.IonIcon['flipRtl']>,
    name: {} as PropOptions<Components.IonIcon['name']>,
    src: {} as PropOptions<Components.IonIcon['src']>,
    icon: {} as PropOptions<Components.IonIcon['icon']>,
    size: {} as PropOptions<Components.IonIcon['size']>,
    lazy: {} as PropOptions<Components.IonIcon['lazy']>,
  },


  render: createCommonRender('ion-icon', []),
});


export const IonImg = /*@__PURE__*/ Vue.extend({

  props: {
    alt: {} as PropOptions<Components.IonImg['alt']>,
    src: {} as PropOptions<Components.IonImg['src']>,
  },


  render: createCommonRender('ion-img', ['ionImgWillLoad', 'ionImgDidLoad', 'ionError']),
});


export const IonInfiniteScroll = /*@__PURE__*/ Vue.extend({

  props: {
    threshold: {} as PropOptions<Components.IonInfiniteScroll['threshold']>,
    disabled: {} as PropOptions<Components.IonInfiniteScroll['disabled']>,
    position: {} as PropOptions<Components.IonInfiniteScroll['position']>,
  },


  methods: {
    complete: createCommonMethod('complete') as Components.IonInfiniteScroll['complete'],
  },
  render: createCommonRender('ion-infinite-scroll', ['ionInfinite']),
});


export const IonInfiniteScrollContent = /*@__PURE__*/ Vue.extend({

  props: {
    loadingSpinner: {} as PropOptions<Components.IonInfiniteScrollContent['loadingSpinner']>,
    loadingText: {} as PropOptions<Components.IonInfiniteScrollContent['loadingText']>,
  },


  render: createCommonRender('ion-infinite-scroll-content', []),
});


export const IonInput = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonInput['color']>,
    accept: {} as PropOptions<Components.IonInput['accept']>,
    autocapitalize: {} as PropOptions<Components.IonInput['autocapitalize']>,
    autocomplete: {} as PropOptions<Components.IonInput['autocomplete']>,
    autocorrect: {} as PropOptions<Components.IonInput['autocorrect']>,
    autofocus: {} as PropOptions<Components.IonInput['autofocus']>,
    clearInput: {} as PropOptions<Components.IonInput['clearInput']>,
    clearOnEdit: {} as PropOptions<Components.IonInput['clearOnEdit']>,
    debounce: {} as PropOptions<Components.IonInput['debounce']>,
    disabled: {} as PropOptions<Components.IonInput['disabled']>,
    enterkeyhint: {} as PropOptions<Components.IonInput['enterkeyhint']>,
    inputmode: {} as PropOptions<Components.IonInput['inputmode']>,
    max: {} as PropOptions<Components.IonInput['max']>,
    maxlength: {} as PropOptions<Components.IonInput['maxlength']>,
    min: {} as PropOptions<Components.IonInput['min']>,
    minlength: {} as PropOptions<Components.IonInput['minlength']>,
    multiple: {} as PropOptions<Components.IonInput['multiple']>,
    name: {} as PropOptions<Components.IonInput['name']>,
    pattern: {} as PropOptions<Components.IonInput['pattern']>,
    placeholder: {} as PropOptions<Components.IonInput['placeholder']>,
    readonly: {} as PropOptions<Components.IonInput['readonly']>,
    required: {} as PropOptions<Components.IonInput['required']>,
    spellcheck: {} as PropOptions<Components.IonInput['spellcheck']>,
    step: {} as PropOptions<Components.IonInput['step']>,
    size: {} as PropOptions<Components.IonInput['size']>,
    type: {} as PropOptions<Components.IonInput['type']>,
    value: {} as PropOptions<Components.IonInput['value']>,
  },

  model: {
    prop: 'value',
    event: 'ionChange'
  },

  methods: {
    setFocus: createCommonMethod('setFocus') as Components.IonInput['setFocus'],
    getInputElement: createCommonMethod('getInputElement') as Components.IonInput['getInputElement'],
  },
  render: createCommonRender('ion-input', ['ionInput', 'ionChange', 'ionBlur', 'ionFocus', 'ionStyle']),
});


export const IonItem = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonItem['color']>,
    button: {} as PropOptions<Components.IonItem['button']>,
    detail: {} as PropOptions<Components.IonItem['detail']>,
    detailIcon: {} as PropOptions<Components.IonItem['detailIcon']>,
    disabled: {} as PropOptions<Components.IonItem['disabled']>,
    download: {} as PropOptions<Components.IonItem['download']>,
    href: {} as PropOptions<Components.IonItem['href']>,
    rel: {} as PropOptions<Components.IonItem['rel']>,
    lines: {} as PropOptions<Components.IonItem['lines']>,
    routerAnimation: {} as PropOptions<Components.IonItem['routerAnimation']>,
    routerDirection: {} as PropOptions<Components.IonItem['routerDirection']>,
    target: {} as PropOptions<Components.IonItem['target']>,
    type: {} as PropOptions<Components.IonItem['type']>,
  },


  render: createCommonRender('ion-item', []),
});


export const IonItemDivider = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonItemDivider['color']>,
    sticky: {} as PropOptions<Components.IonItemDivider['sticky']>,
  },


  render: createCommonRender('ion-item-divider', []),
});


export const IonItemGroup = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-item-group', []),
});


export const IonItemOption = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonItemOption['color']>,
    disabled: {} as PropOptions<Components.IonItemOption['disabled']>,
    download: {} as PropOptions<Components.IonItemOption['download']>,
    expandable: {} as PropOptions<Components.IonItemOption['expandable']>,
    href: {} as PropOptions<Components.IonItemOption['href']>,
    rel: {} as PropOptions<Components.IonItemOption['rel']>,
    target: {} as PropOptions<Components.IonItemOption['target']>,
    type: {} as PropOptions<Components.IonItemOption['type']>,
  },


  render: createCommonRender('ion-item-option', []),
});


export const IonItemOptions = /*@__PURE__*/ Vue.extend({

  props: {
    side: {} as PropOptions<Components.IonItemOptions['side']>,
  },


  methods: {
    fireSwipeEvent: createCommonMethod('fireSwipeEvent') as Components.IonItemOptions['fireSwipeEvent'],
  },
  render: createCommonRender('ion-item-options', ['ionSwipe']),
});


export const IonItemSliding = /*@__PURE__*/ Vue.extend({

  props: {
    disabled: {} as PropOptions<Components.IonItemSliding['disabled']>,
  },


  methods: {
    getOpenAmount: createCommonMethod('getOpenAmount') as Components.IonItemSliding['getOpenAmount'],
    getSlidingRatio: createCommonMethod('getSlidingRatio') as Components.IonItemSliding['getSlidingRatio'],
    open: createCommonMethod('open') as Components.IonItemSliding['open'],
    close: createCommonMethod('close') as Components.IonItemSliding['close'],
    closeOpened: createCommonMethod('closeOpened') as Components.IonItemSliding['closeOpened'],
  },
  render: createCommonRender('ion-item-sliding', ['ionDrag']),
});


export const IonLabel = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonLabel['color']>,
    position: {} as PropOptions<Components.IonLabel['position']>,
  },


  render: createCommonRender('ion-label', ['ionStyle']),
});


export const IonList = /*@__PURE__*/ Vue.extend({

  props: {
    lines: {} as PropOptions<Components.IonList['lines']>,
    inset: {} as PropOptions<Components.IonList['inset']>,
  },


  methods: {
    closeSlidingItems: createCommonMethod('closeSlidingItems') as Components.IonList['closeSlidingItems'],
  },
  render: createCommonRender('ion-list', []),
});


export const IonListHeader = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonListHeader['color']>,
    lines: {} as PropOptions<Components.IonListHeader['lines']>,
  },


  render: createCommonRender('ion-list-header', []),
});


export const IonLoading = /*@__PURE__*/ Vue.extend({

  props: {
    overlayIndex: {} as PropOptions<Components.IonLoading['overlayIndex']>,
    keyboardClose: {} as PropOptions<Components.IonLoading['keyboardClose']>,
    enterAnimation: {} as PropOptions<Components.IonLoading['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonLoading['leaveAnimation']>,
    message: {} as PropOptions<Components.IonLoading['message']>,
    cssClass: {} as PropOptions<Components.IonLoading['cssClass']>,
    duration: {} as PropOptions<Components.IonLoading['duration']>,
    backdropDismiss: {} as PropOptions<Components.IonLoading['backdropDismiss']>,
    showBackdrop: {} as PropOptions<Components.IonLoading['showBackdrop']>,
    spinner: {} as PropOptions<Components.IonLoading['spinner']>,
    translucent: {} as PropOptions<Components.IonLoading['translucent']>,
    animated: {} as PropOptions<Components.IonLoading['animated']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonLoading['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonLoading['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonLoading['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonLoading['onWillDismiss'],
  },
  render: createCommonRender('ion-loading', ['ionLoadingDidPresent', 'ionLoadingWillPresent', 'ionLoadingWillDismiss', 'ionLoadingDidDismiss']),
});


export const IonMenu = /*@__PURE__*/ Vue.extend({

  props: {
    contentId: {} as PropOptions<Components.IonMenu['contentId']>,
    menuId: {} as PropOptions<Components.IonMenu['menuId']>,
    type: {} as PropOptions<Components.IonMenu['type']>,
    disabled: {} as PropOptions<Components.IonMenu['disabled']>,
    side: {} as PropOptions<Components.IonMenu['side']>,
    swipeGesture: {} as PropOptions<Components.IonMenu['swipeGesture']>,
    maxEdgeStart: {} as PropOptions<Components.IonMenu['maxEdgeStart']>,
  },


  methods: {
    isOpen: createCommonMethod('isOpen') as Components.IonMenu['isOpen'],
    isActive: createCommonMethod('isActive') as Components.IonMenu['isActive'],
    open: createCommonMethod('open') as Components.IonMenu['open'],
    close: createCommonMethod('close') as Components.IonMenu['close'],
    toggle: createCommonMethod('toggle') as Components.IonMenu['toggle'],
    setOpen: createCommonMethod('setOpen') as Components.IonMenu['setOpen'],
  },
  render: createCommonRender('ion-menu', ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose', 'ionMenuChange']),
});


export const IonMenuButton = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonMenuButton['color']>,
    disabled: {} as PropOptions<Components.IonMenuButton['disabled']>,
    menu: {} as PropOptions<Components.IonMenuButton['menu']>,
    autoHide: {} as PropOptions<Components.IonMenuButton['autoHide']>,
    type: {} as PropOptions<Components.IonMenuButton['type']>,
  },


  render: createCommonRender('ion-menu-button', []),
});


export const IonMenuToggle = /*@__PURE__*/ Vue.extend({

  props: {
    menu: {} as PropOptions<Components.IonMenuToggle['menu']>,
    autoHide: {} as PropOptions<Components.IonMenuToggle['autoHide']>,
  },


  render: createCommonRender('ion-menu-toggle', []),
});


export const IonModal = /*@__PURE__*/ Vue.extend({

  props: {
    overlayIndex: {} as PropOptions<Components.IonModal['overlayIndex']>,
    delegate: {} as PropOptions<Components.IonModal['delegate']>,
    keyboardClose: {} as PropOptions<Components.IonModal['keyboardClose']>,
    enterAnimation: {} as PropOptions<Components.IonModal['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonModal['leaveAnimation']>,
    component: {} as PropOptions<Components.IonModal['component']>,
    componentProps: {} as PropOptions<Components.IonModal['componentProps']>,
    cssClass: {} as PropOptions<Components.IonModal['cssClass']>,
    backdropDismiss: {} as PropOptions<Components.IonModal['backdropDismiss']>,
    showBackdrop: {} as PropOptions<Components.IonModal['showBackdrop']>,
    animated: {} as PropOptions<Components.IonModal['animated']>,
    swipeToClose: {} as PropOptions<Components.IonModal['swipeToClose']>,
    presentingElement: {} as PropOptions<Components.IonModal['presentingElement']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonModal['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonModal['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonModal['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonModal['onWillDismiss'],
  },
  render: createCommonRender('ion-modal', ['ionModalDidPresent', 'ionModalWillPresent', 'ionModalWillDismiss', 'ionModalDidDismiss']),
});


export const IonNav = /*@__PURE__*/ Vue.extend({

  props: {
    delegate: {} as PropOptions<Components.IonNav['delegate']>,
    swipeGesture: {} as PropOptions<Components.IonNav['swipeGesture']>,
    animated: {} as PropOptions<Components.IonNav['animated']>,
    animation: {} as PropOptions<Components.IonNav['animation']>,
    rootParams: {} as PropOptions<Components.IonNav['rootParams']>,
    root: {} as PropOptions<Components.IonNav['root']>,
  },


  methods: {
    push: createCommonMethod('push') as Components.IonNav['push'],
    insert: createCommonMethod('insert') as Components.IonNav['insert'],
    insertPages: createCommonMethod('insertPages') as Components.IonNav['insertPages'],
    pop: createCommonMethod('pop') as Components.IonNav['pop'],
    popTo: createCommonMethod('popTo') as Components.IonNav['popTo'],
    popToRoot: createCommonMethod('popToRoot') as Components.IonNav['popToRoot'],
    removeIndex: createCommonMethod('removeIndex') as Components.IonNav['removeIndex'],
    setRoot: createCommonMethod('setRoot') as Components.IonNav['setRoot'],
    setPages: createCommonMethod('setPages') as Components.IonNav['setPages'],
    setRouteId: createCommonMethod('setRouteId') as Components.IonNav['setRouteId'],
    getRouteId: createCommonMethod('getRouteId') as Components.IonNav['getRouteId'],
    getActive: createCommonMethod('getActive') as Components.IonNav['getActive'],
    getByIndex: createCommonMethod('getByIndex') as Components.IonNav['getByIndex'],
    canGoBack: createCommonMethod('canGoBack') as Components.IonNav['canGoBack'],
    getPrevious: createCommonMethod('getPrevious') as Components.IonNav['getPrevious'],
  },
  render: createCommonRender('ion-nav', ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']),
});


export const IonNavLink = /*@__PURE__*/ Vue.extend({

  props: {
    component: {} as PropOptions<Components.IonNavLink['component']>,
    componentProps: {} as PropOptions<Components.IonNavLink['componentProps']>,
    routerDirection: {} as PropOptions<Components.IonNavLink['routerDirection']>,
    routerAnimation: {} as PropOptions<Components.IonNavLink['routerAnimation']>,
  },


  render: createCommonRender('ion-nav-link', []),
});


export const IonNote = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonNote['color']>,
  },


  render: createCommonRender('ion-note', []),
});


export const IonPicker = /*@__PURE__*/ Vue.extend({

  props: {
    overlayIndex: {} as PropOptions<Components.IonPicker['overlayIndex']>,
    keyboardClose: {} as PropOptions<Components.IonPicker['keyboardClose']>,
    enterAnimation: {} as PropOptions<Components.IonPicker['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonPicker['leaveAnimation']>,
    buttons: {} as PropOptions<Components.IonPicker['buttons']>,
    columns: {} as PropOptions<Components.IonPicker['columns']>,
    cssClass: {} as PropOptions<Components.IonPicker['cssClass']>,
    duration: {} as PropOptions<Components.IonPicker['duration']>,
    showBackdrop: {} as PropOptions<Components.IonPicker['showBackdrop']>,
    backdropDismiss: {} as PropOptions<Components.IonPicker['backdropDismiss']>,
    animated: {} as PropOptions<Components.IonPicker['animated']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonPicker['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonPicker['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonPicker['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonPicker['onWillDismiss'],
    getColumn: createCommonMethod('getColumn') as Components.IonPicker['getColumn'],
  },
  render: createCommonRender('ion-picker', ['ionPickerDidPresent', 'ionPickerWillPresent', 'ionPickerWillDismiss', 'ionPickerDidDismiss']),
});


export const IonPopover = /*@__PURE__*/ Vue.extend({

  props: {
    delegate: {} as PropOptions<Components.IonPopover['delegate']>,
    overlayIndex: {} as PropOptions<Components.IonPopover['overlayIndex']>,
    enterAnimation: {} as PropOptions<Components.IonPopover['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonPopover['leaveAnimation']>,
    component: {} as PropOptions<Components.IonPopover['component']>,
    componentProps: {} as PropOptions<Components.IonPopover['componentProps']>,
    keyboardClose: {} as PropOptions<Components.IonPopover['keyboardClose']>,
    cssClass: {} as PropOptions<Components.IonPopover['cssClass']>,
    backdropDismiss: {} as PropOptions<Components.IonPopover['backdropDismiss']>,
    event: {} as PropOptions<Components.IonPopover['event']>,
    showBackdrop: {} as PropOptions<Components.IonPopover['showBackdrop']>,
    translucent: {} as PropOptions<Components.IonPopover['translucent']>,
    animated: {} as PropOptions<Components.IonPopover['animated']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonPopover['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonPopover['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonPopover['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonPopover['onWillDismiss'],
  },
  render: createCommonRender('ion-popover', ['ionPopoverDidPresent', 'ionPopoverWillPresent', 'ionPopoverWillDismiss', 'ionPopoverDidDismiss']),
});


export const IonProgressBar = /*@__PURE__*/ Vue.extend({

  props: {
    type: {} as PropOptions<Components.IonProgressBar['type']>,
    reversed: {} as PropOptions<Components.IonProgressBar['reversed']>,
    value: {} as PropOptions<Components.IonProgressBar['value']>,
    buffer: {} as PropOptions<Components.IonProgressBar['buffer']>,
    color: {} as PropOptions<Components.IonProgressBar['color']>,
  },


  render: createCommonRender('ion-progress-bar', []),
});


export const IonRadio = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonRadio['color']>,
    name: {} as PropOptions<Components.IonRadio['name']>,
    disabled: {} as PropOptions<Components.IonRadio['disabled']>,
    value: {} as PropOptions<Components.IonRadio['value']>,
  },


  render: createCommonRender('ion-radio', ['ionStyle', 'ionFocus', 'ionBlur']),
});


export const IonRadioGroup = /*@__PURE__*/ Vue.extend({

  props: {
    allowEmptySelection: {} as PropOptions<Components.IonRadioGroup['allowEmptySelection']>,
    name: {} as PropOptions<Components.IonRadioGroup['name']>,
    value: {} as PropOptions<Components.IonRadioGroup['value']>,
  },


  render: createCommonRender('ion-radio-group', ['ionChange']),
});


export const IonRange = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonRange['color']>,
    debounce: {} as PropOptions<Components.IonRange['debounce']>,
    name: {} as PropOptions<Components.IonRange['name']>,
    dualKnobs: {} as PropOptions<Components.IonRange['dualKnobs']>,
    min: {} as PropOptions<Components.IonRange['min']>,
    max: {} as PropOptions<Components.IonRange['max']>,
    pin: {} as PropOptions<Components.IonRange['pin']>,
    snaps: {} as PropOptions<Components.IonRange['snaps']>,
    step: {} as PropOptions<Components.IonRange['step']>,
    ticks: {} as PropOptions<Components.IonRange['ticks']>,
    disabled: {} as PropOptions<Components.IonRange['disabled']>,
    value: {} as PropOptions<Components.IonRange['value']>,
  },


  render: createCommonRender('ion-range', ['ionChange', 'ionStyle', 'ionFocus', 'ionBlur']),
});


export const IonRefresher = /*@__PURE__*/ Vue.extend({

  props: {
    pullMin: {} as PropOptions<Components.IonRefresher['pullMin']>,
    pullMax: {} as PropOptions<Components.IonRefresher['pullMax']>,
    closeDuration: {} as PropOptions<Components.IonRefresher['closeDuration']>,
    snapbackDuration: {} as PropOptions<Components.IonRefresher['snapbackDuration']>,
    pullFactor: {} as PropOptions<Components.IonRefresher['pullFactor']>,
    disabled: {} as PropOptions<Components.IonRefresher['disabled']>,
  },


  methods: {
    complete: createCommonMethod('complete') as Components.IonRefresher['complete'],
    cancel: createCommonMethod('cancel') as Components.IonRefresher['cancel'],
    getProgress: createCommonMethod('getProgress') as Components.IonRefresher['getProgress'],
  },
  render: createCommonRender('ion-refresher', ['ionRefresh', 'ionPull', 'ionStart']),
});


export const IonRefresherContent = /*@__PURE__*/ Vue.extend({

  props: {
    pullingIcon: {} as PropOptions<Components.IonRefresherContent['pullingIcon']>,
    pullingText: {} as PropOptions<Components.IonRefresherContent['pullingText']>,
    refreshingSpinner: {} as PropOptions<Components.IonRefresherContent['refreshingSpinner']>,
    refreshingText: {} as PropOptions<Components.IonRefresherContent['refreshingText']>,
  },


  render: createCommonRender('ion-refresher-content', []),
});


export const IonReorder = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-reorder', []),
});


export const IonReorderGroup = /*@__PURE__*/ Vue.extend({

  props: {
    disabled: {} as PropOptions<Components.IonReorderGroup['disabled']>,
  },


  methods: {
    complete: createCommonMethod('complete') as Components.IonReorderGroup['complete'],
  },
  render: createCommonRender('ion-reorder-group', ['ionItemReorder']),
});


export const IonRippleEffect = /*@__PURE__*/ Vue.extend({

  props: {
    type: {} as PropOptions<Components.IonRippleEffect['type']>,
  },


  methods: {
    addRipple: createCommonMethod('addRipple') as Components.IonRippleEffect['addRipple'],
  },
  render: createCommonRender('ion-ripple-effect', []),
});


export const IonRoute = /*@__PURE__*/ Vue.extend({

  props: {
    url: {} as PropOptions<Components.IonRoute['url']>,
    component: {} as PropOptions<Components.IonRoute['component']>,
    componentProps: {} as PropOptions<Components.IonRoute['componentProps']>,
  },


  render: createCommonRender('ion-route', ['ionRouteDataChanged']),
});


export const IonRouteRedirect = /*@__PURE__*/ Vue.extend({

  props: {
    from: {} as PropOptions<Components.IonRouteRedirect['from']>,
    to: {} as PropOptions<Components.IonRouteRedirect['to']>,
  },


  render: createCommonRender('ion-route-redirect', ['ionRouteRedirectChanged']),
});


export const IonRouter = /*@__PURE__*/ Vue.extend({

  props: {
    root: {} as PropOptions<Components.IonRouter['root']>,
    useHash: {} as PropOptions<Components.IonRouter['useHash']>,
  },


  methods: {
    push: createCommonMethod('push') as Components.IonRouter['push'],
    back: createCommonMethod('back') as Components.IonRouter['back'],
    printDebug: createCommonMethod('printDebug') as Components.IonRouter['printDebug'],
    navChanged: createCommonMethod('navChanged') as Components.IonRouter['navChanged'],
  },
  render: createCommonRender('ion-router', ['ionRouteWillChange', 'ionRouteDidChange']),
});


export const IonRouterLink = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonRouterLink['color']>,
    href: {} as PropOptions<Components.IonRouterLink['href']>,
    rel: {} as PropOptions<Components.IonRouterLink['rel']>,
    routerDirection: {} as PropOptions<Components.IonRouterLink['routerDirection']>,
    routerAnimation: {} as PropOptions<Components.IonRouterLink['routerAnimation']>,
    target: {} as PropOptions<Components.IonRouterLink['target']>,
  },


  render: createCommonRender('ion-router-link', []),
});


export const IonRouterOutlet = /*@__PURE__*/ Vue.extend({

  props: {
    mode: {} as PropOptions<Components.IonRouterOutlet['mode']>,
    delegate: {} as PropOptions<Components.IonRouterOutlet['delegate']>,
    animated: {} as PropOptions<Components.IonRouterOutlet['animated']>,
    animation: {} as PropOptions<Components.IonRouterOutlet['animation']>,
    swipeHandler: {} as PropOptions<Components.IonRouterOutlet['swipeHandler']>,
  },


  methods: {
    commit: createCommonMethod('commit') as Components.IonRouterOutlet['commit'],
    setRouteId: createCommonMethod('setRouteId') as Components.IonRouterOutlet['setRouteId'],
    getRouteId: createCommonMethod('getRouteId') as Components.IonRouterOutlet['getRouteId'],
  },
  render: createCommonRender('ion-router-outlet', ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']),
});


export const IonRow = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-row', []),
});


export const IonSearchbar = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonSearchbar['color']>,
    animated: {} as PropOptions<Components.IonSearchbar['animated']>,
    autocomplete: {} as PropOptions<Components.IonSearchbar['autocomplete']>,
    autocorrect: {} as PropOptions<Components.IonSearchbar['autocorrect']>,
    cancelButtonIcon: {} as PropOptions<Components.IonSearchbar['cancelButtonIcon']>,
    cancelButtonText: {} as PropOptions<Components.IonSearchbar['cancelButtonText']>,
    clearIcon: {} as PropOptions<Components.IonSearchbar['clearIcon']>,
    debounce: {} as PropOptions<Components.IonSearchbar['debounce']>,
    disabled: {} as PropOptions<Components.IonSearchbar['disabled']>,
    inputmode: {} as PropOptions<Components.IonSearchbar['inputmode']>,
    enterkeyhint: {} as PropOptions<Components.IonSearchbar['enterkeyhint']>,
    placeholder: {} as PropOptions<Components.IonSearchbar['placeholder']>,
    searchIcon: {} as PropOptions<Components.IonSearchbar['searchIcon']>,
    showCancelButton: {} as PropOptions<Components.IonSearchbar['showCancelButton']>,
    spellcheck: {} as PropOptions<Components.IonSearchbar['spellcheck']>,
    type: {} as PropOptions<Components.IonSearchbar['type']>,
    value: {} as PropOptions<Components.IonSearchbar['value']>,
  },


  methods: {
    setFocus: createCommonMethod('setFocus') as Components.IonSearchbar['setFocus'],
    getInputElement: createCommonMethod('getInputElement') as Components.IonSearchbar['getInputElement'],
  },
  render: createCommonRender('ion-searchbar', ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus', 'ionStyle']),
});


export const IonSegment = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonSegment['color']>,
    disabled: {} as PropOptions<Components.IonSegment['disabled']>,
    scrollable: {} as PropOptions<Components.IonSegment['scrollable']>,
    value: {} as PropOptions<Components.IonSegment['value']>,
  },


  render: createCommonRender('ion-segment', ['ionChange', 'ionSelect', 'ionStyle']),
});


export const IonSegmentButton = /*@__PURE__*/ Vue.extend({

  props: {
    disabled: {} as PropOptions<Components.IonSegmentButton['disabled']>,
    layout: {} as PropOptions<Components.IonSegmentButton['layout']>,
    type: {} as PropOptions<Components.IonSegmentButton['type']>,
    value: {} as PropOptions<Components.IonSegmentButton['value']>,
  },


  render: createCommonRender('ion-segment-button', []),
});


export const IonSelect = /*@__PURE__*/ Vue.extend({

  props: {
    disabled: {} as PropOptions<Components.IonSelect['disabled']>,
    cancelText: {} as PropOptions<Components.IonSelect['cancelText']>,
    okText: {} as PropOptions<Components.IonSelect['okText']>,
    placeholder: {} as PropOptions<Components.IonSelect['placeholder']>,
    name: {} as PropOptions<Components.IonSelect['name']>,
    selectedText: {} as PropOptions<Components.IonSelect['selectedText']>,
    multiple: {} as PropOptions<Components.IonSelect['multiple']>,
    interface: {} as PropOptions<Components.IonSelect['interface']>,
    interfaceOptions: {} as PropOptions<Components.IonSelect['interfaceOptions']>,
    compareWith: {} as PropOptions<Components.IonSelect['compareWith']>,
    value: {} as PropOptions<Components.IonSelect['value']>,
  },


  methods: {
    open: createCommonMethod('open') as Components.IonSelect['open'],
  },
  render: createCommonRender('ion-select', ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur', 'ionStyle']),
});


export const IonSelectOption = /*@__PURE__*/ Vue.extend({

  props: {
    disabled: {} as PropOptions<Components.IonSelectOption['disabled']>,
    value: {} as PropOptions<Components.IonSelectOption['value']>,
  },


  render: createCommonRender('ion-select-option', []),
});


export const IonSkeletonText = /*@__PURE__*/ Vue.extend({

  props: {
    animated: {} as PropOptions<Components.IonSkeletonText['animated']>,
  },


  render: createCommonRender('ion-skeleton-text', []),
});


export const IonSlide = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-slide', []),
});


export const IonSlides = /*@__PURE__*/ Vue.extend({

  props: {
    options: {} as PropOptions<Components.IonSlides['options']>,
    pager: {} as PropOptions<Components.IonSlides['pager']>,
    scrollbar: {} as PropOptions<Components.IonSlides['scrollbar']>,
  },


  methods: {
    update: createCommonMethod('update') as Components.IonSlides['update'],
    updateAutoHeight: createCommonMethod('updateAutoHeight') as Components.IonSlides['updateAutoHeight'],
    slideTo: createCommonMethod('slideTo') as Components.IonSlides['slideTo'],
    slideNext: createCommonMethod('slideNext') as Components.IonSlides['slideNext'],
    slidePrev: createCommonMethod('slidePrev') as Components.IonSlides['slidePrev'],
    getActiveIndex: createCommonMethod('getActiveIndex') as Components.IonSlides['getActiveIndex'],
    getPreviousIndex: createCommonMethod('getPreviousIndex') as Components.IonSlides['getPreviousIndex'],
    length: createCommonMethod('length') as Components.IonSlides['length'],
    isEnd: createCommonMethod('isEnd') as Components.IonSlides['isEnd'],
    isBeginning: createCommonMethod('isBeginning') as Components.IonSlides['isBeginning'],
    startAutoplay: createCommonMethod('startAutoplay') as Components.IonSlides['startAutoplay'],
    stopAutoplay: createCommonMethod('stopAutoplay') as Components.IonSlides['stopAutoplay'],
    lockSwipeToNext: createCommonMethod('lockSwipeToNext') as Components.IonSlides['lockSwipeToNext'],
    lockSwipeToPrev: createCommonMethod('lockSwipeToPrev') as Components.IonSlides['lockSwipeToPrev'],
    lockSwipes: createCommonMethod('lockSwipes') as Components.IonSlides['lockSwipes'],
    getSwiper: createCommonMethod('getSwiper') as Components.IonSlides['getSwiper'],
  },
  render: createCommonRender('ion-slides', ['ionSlidesDidLoad', 'ionSlideTap', 'ionSlideDoubleTap', 'ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']),
});


export const IonSpinner = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonSpinner['color']>,
    duration: {} as PropOptions<Components.IonSpinner['duration']>,
    name: {} as PropOptions<Components.IonSpinner['name']>,
    paused: {} as PropOptions<Components.IonSpinner['paused']>,
  },


  render: createCommonRender('ion-spinner', []),
});


export const IonSplitPane = /*@__PURE__*/ Vue.extend({

  props: {
    contentId: {} as PropOptions<Components.IonSplitPane['contentId']>,
    disabled: {} as PropOptions<Components.IonSplitPane['disabled']>,
    when: {} as PropOptions<Components.IonSplitPane['when']>,
  },


  render: createCommonRender('ion-split-pane', ['ionSplitPaneVisible']),
});


export const IonTab = /*@__PURE__*/ Vue.extend({

  props: {
    active: {} as PropOptions<Components.IonTab['active']>,
    delegate: {} as PropOptions<Components.IonTab['delegate']>,
    tab: {} as PropOptions<Components.IonTab['tab']>,
    component: {} as PropOptions<Components.IonTab['component']>,
  },


  methods: {
    setActive: createCommonMethod('setActive') as Components.IonTab['setActive'],
  },
  render: createCommonRender('ion-tab', []),
});


export const IonTabBar = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonTabBar['color']>,
    selectedTab: {} as PropOptions<Components.IonTabBar['selectedTab']>,
    translucent: {} as PropOptions<Components.IonTabBar['translucent']>,
  },


  render: createCommonRender('ion-tab-bar', ['ionTabBarChanged']),
});


export const IonTabButton = /*@__PURE__*/ Vue.extend({

  props: {
    disabled: {} as PropOptions<Components.IonTabButton['disabled']>,
    download: {} as PropOptions<Components.IonTabButton['download']>,
    href: {} as PropOptions<Components.IonTabButton['href']>,
    rel: {} as PropOptions<Components.IonTabButton['rel']>,
    layout: {} as PropOptions<Components.IonTabButton['layout']>,
    selected: {} as PropOptions<Components.IonTabButton['selected']>,
    tab: {} as PropOptions<Components.IonTabButton['tab']>,
    target: {} as PropOptions<Components.IonTabButton['target']>,
  },


  render: createCommonRender('ion-tab-button', ['ionTabButtonClick']),
});


export const IonTabs = /*@__PURE__*/ Vue.extend({

  props: {
    useRouter: {} as PropOptions<Components.IonTabs['useRouter']>,
  },


  methods: {
    select: createCommonMethod('select') as Components.IonTabs['select'],
    getTab: createCommonMethod('getTab') as Components.IonTabs['getTab'],
    getSelected: createCommonMethod('getSelected') as Components.IonTabs['getSelected'],
    setRouteId: createCommonMethod('setRouteId') as Components.IonTabs['setRouteId'],
    getRouteId: createCommonMethod('getRouteId') as Components.IonTabs['getRouteId'],
  },
  render: createCommonRender('ion-tabs', ['ionNavWillLoad', 'ionTabsWillChange', 'ionTabsDidChange']),
});


export const IonText = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonText['color']>,
  },


  render: createCommonRender('ion-text', []),
});


export const IonTextarea = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonTextarea['color']>,
    autocapitalize: {} as PropOptions<Components.IonTextarea['autocapitalize']>,
    autofocus: {} as PropOptions<Components.IonTextarea['autofocus']>,
    clearOnEdit: {} as PropOptions<Components.IonTextarea['clearOnEdit']>,
    debounce: {} as PropOptions<Components.IonTextarea['debounce']>,
    disabled: {} as PropOptions<Components.IonTextarea['disabled']>,
    inputmode: {} as PropOptions<Components.IonTextarea['inputmode']>,
    enterkeyhint: {} as PropOptions<Components.IonTextarea['enterkeyhint']>,
    maxlength: {} as PropOptions<Components.IonTextarea['maxlength']>,
    minlength: {} as PropOptions<Components.IonTextarea['minlength']>,
    name: {} as PropOptions<Components.IonTextarea['name']>,
    placeholder: {} as PropOptions<Components.IonTextarea['placeholder']>,
    readonly: {} as PropOptions<Components.IonTextarea['readonly']>,
    required: {} as PropOptions<Components.IonTextarea['required']>,
    spellcheck: {} as PropOptions<Components.IonTextarea['spellcheck']>,
    cols: {} as PropOptions<Components.IonTextarea['cols']>,
    rows: {} as PropOptions<Components.IonTextarea['rows']>,
    wrap: {} as PropOptions<Components.IonTextarea['wrap']>,
    autoGrow: {} as PropOptions<Components.IonTextarea['autoGrow']>,
    value: {} as PropOptions<Components.IonTextarea['value']>,
  },


  methods: {
    setFocus: createCommonMethod('setFocus') as Components.IonTextarea['setFocus'],
    getInputElement: createCommonMethod('getInputElement') as Components.IonTextarea['getInputElement'],
  },
  render: createCommonRender('ion-textarea', ['ionChange', 'ionInput', 'ionStyle', 'ionBlur', 'ionFocus']),
});


export const IonThumbnail = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('ion-thumbnail', []),
});


export const IonTitle = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonTitle['color']>,
    size: {} as PropOptions<Components.IonTitle['size']>,
  },


  render: createCommonRender('ion-title', ['ionStyle']),
});


export const IonToast = /*@__PURE__*/ Vue.extend({

  props: {
    overlayIndex: {} as PropOptions<Components.IonToast['overlayIndex']>,
    color: {} as PropOptions<Components.IonToast['color']>,
    enterAnimation: {} as PropOptions<Components.IonToast['enterAnimation']>,
    leaveAnimation: {} as PropOptions<Components.IonToast['leaveAnimation']>,
    cssClass: {} as PropOptions<Components.IonToast['cssClass']>,
    duration: {} as PropOptions<Components.IonToast['duration']>,
    header: {} as PropOptions<Components.IonToast['header']>,
    message: {} as PropOptions<Components.IonToast['message']>,
    keyboardClose: {} as PropOptions<Components.IonToast['keyboardClose']>,
    position: {} as PropOptions<Components.IonToast['position']>,
    buttons: {} as PropOptions<Components.IonToast['buttons']>,
    translucent: {} as PropOptions<Components.IonToast['translucent']>,
    animated: {} as PropOptions<Components.IonToast['animated']>,
  },


  methods: {
    present: createCommonMethod('present') as Components.IonToast['present'],
    dismiss: createCommonMethod('dismiss') as Components.IonToast['dismiss'],
    onDidDismiss: createCommonMethod('onDidDismiss') as Components.IonToast['onDidDismiss'],
    onWillDismiss: createCommonMethod('onWillDismiss') as Components.IonToast['onWillDismiss'],
  },
  render: createCommonRender('ion-toast', ['ionToastDidPresent', 'ionToastWillPresent', 'ionToastWillDismiss', 'ionToastDidDismiss']),
});


export const IonToggle = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonToggle['color']>,
    name: {} as PropOptions<Components.IonToggle['name']>,
    checked: {} as PropOptions<Components.IonToggle['checked']>,
    disabled: {} as PropOptions<Components.IonToggle['disabled']>,
    value: {} as PropOptions<Components.IonToggle['value']>,
  },


  render: createCommonRender('ion-toggle', ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']),
});


export const IonToolbar = /*@__PURE__*/ Vue.extend({

  props: {
    color: {} as PropOptions<Components.IonToolbar['color']>,
  },


  render: createCommonRender('ion-toolbar', []),
});


export const IonVirtualScroll = /*@__PURE__*/ Vue.extend({

  props: {
    approxItemHeight: {} as PropOptions<Components.IonVirtualScroll['approxItemHeight']>,
    approxHeaderHeight: {} as PropOptions<Components.IonVirtualScroll['approxHeaderHeight']>,
    approxFooterHeight: {} as PropOptions<Components.IonVirtualScroll['approxFooterHeight']>,
    headerFn: {} as PropOptions<Components.IonVirtualScroll['headerFn']>,
    footerFn: {} as PropOptions<Components.IonVirtualScroll['footerFn']>,
    items: {} as PropOptions<Components.IonVirtualScroll['items']>,
    itemHeight: {} as PropOptions<Components.IonVirtualScroll['itemHeight']>,
    headerHeight: {} as PropOptions<Components.IonVirtualScroll['headerHeight']>,
    footerHeight: {} as PropOptions<Components.IonVirtualScroll['footerHeight']>,
    renderItem: {} as PropOptions<Components.IonVirtualScroll['renderItem']>,
    renderHeader: {} as PropOptions<Components.IonVirtualScroll['renderHeader']>,
    renderFooter: {} as PropOptions<Components.IonVirtualScroll['renderFooter']>,
    nodeRender: {} as PropOptions<Components.IonVirtualScroll['nodeRender']>,
    domRender: {} as PropOptions<Components.IonVirtualScroll['domRender']>,
  },


  methods: {
    positionForItem: createCommonMethod('positionForItem') as Components.IonVirtualScroll['positionForItem'],
    checkRange: createCommonMethod('checkRange') as Components.IonVirtualScroll['checkRange'],
    checkEnd: createCommonMethod('checkEnd') as Components.IonVirtualScroll['checkEnd'],
  },
  render: createCommonRender('ion-virtual-scroll', []),
});

