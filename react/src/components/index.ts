import { addIcons } from 'ionicons';
import { ICON_PATHS } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/core/loader';
import { Components as IoniconsComponents } from 'ionicons';
import { Components } from '@ionic/core';
import { createReactComponent } from './createComponent';
export { AlertButton, AlertInput } from '@ionic/core';

// createControllerComponent
export { default as IonAlert } from './IonAlert';
export { default as IonLoading } from './IonLoading';
export { default as IonToast } from './IonToast';

// createOverlayComponent
export { default as IonActionSheet } from './IonActionSheet';
export { default as IonModal } from './IonModal';
export { default as IonPopover } from './IonPopover';

// Custom Components
export { default as IonPage } from './IonPage';
export { default as IonTabs } from './navigation/IonTabs';
export { default as IonTabBar } from './navigation/IonTabBar';
export { IonRouterOutlet, IonBackButton } from './navigation/IonRouterOutlet';

addIcons(ICON_PATHS);
defineCustomElements(window);

// ionicons
export const IonIcon = createReactComponent<IoniconsComponents.IonIconAttributes, HTMLIonIconElement>('ion-icon');

// createReactComponent
export const IonTabBarInner = createReactComponent<Components.IonTabBarAttributes, HTMLIonTabBarElement>('ion-tab-bar');
export const IonRouterOutletInner = createReactComponent<Components.IonRouterOutletAttributes, HTMLIonRouterOutletElement>('ion-router-outlet');
export const IonBackButtonInner = createReactComponent<Components.IonBackButtonAttributes, HTMLIonBackButtonElement>('ion-back-button');
export const IonTab = createReactComponent<Components.IonTabAttributes, HTMLIonTabElement>('ion-tab');
export const IonTabButton = createReactComponent<Components.IonTabButtonAttributes, HTMLIonTabButtonElement>('ion-tab-button');
export const IonAnchor = createReactComponent<Components.IonAnchorAttributes, HTMLIonAnchorElement>('ion-anchor');
export const IonApp = createReactComponent<Components.IonAppAttributes, HTMLIonAppElement>('ion-app');
export const IonAvatar = createReactComponent<Components.IonAvatarAttributes, HTMLIonAvatarElement>('ion-avatar');
export const IonBackdrop = createReactComponent<Components.IonBackdropAttributes, HTMLIonBackdropElement>('ion-backdrop');
export const IonBadge = createReactComponent<Components.IonBadgeAttributes, HTMLIonBadgeElement>('ion-badge');
export const IonButton = createReactComponent<Components.IonButtonAttributes, HTMLIonButtonElement>('ion-button');
export const IonButtons = createReactComponent<Components.IonButtonsAttributes, HTMLIonButtonsElement>('ion-buttons');
export const IonCard = createReactComponent<Components.IonCardAttributes, HTMLIonCardElement>('ion-card');
export const IonCardContent = createReactComponent<Components.IonCardContentAttributes, HTMLIonCardContentElement>('ion-card-content');
export const IonCardHeader = createReactComponent<Components.IonCardHeaderAttributes, HTMLIonCardHeaderElement>('ion-card-header');
export const IonCardSubtitle = createReactComponent<Components.IonCardSubtitleAttributes, HTMLIonCardSubtitleElement>('ion-card-subtitle');
export const IonCardTitle = createReactComponent<Components.IonCardTitleAttributes, HTMLIonCardTitleElement>('ion-card-title');
export const IonCheckbox = createReactComponent<Components.IonCheckboxAttributes, HTMLIonCheckboxElement>('ion-checkbox');
export const IonCol = createReactComponent<Components.IonColAttributes, HTMLIonColElement>('ion-col');
export const IonContent = createReactComponent<Components.IonContentAttributes, HTMLIonContentElement>('ion-content');
export const IonChip = createReactComponent<Components.IonChipAttributes, HTMLIonChipElement>('ion-chip');
export const IonDatetime = createReactComponent<Components.IonDatetimeAttributes, HTMLIonDatetimeElement>('ion-datetime');
export const IonFab= createReactComponent<Components.IonFabAttributes, HTMLIonFabElement>('ion-fab');
export const IonFabButton= createReactComponent<Components.IonFabButtonAttributes, HTMLIonFabButtonElement>('ion-fab-button');
export const IonFabList = createReactComponent<Components.IonFabListAttributes, HTMLIonFabListElement>('ion-fab-list');
export const IonFooter = createReactComponent<Components.IonFooterAttributes, HTMLIonFooterElement>('ion-footer');
export const IonGrid = createReactComponent<Components.IonGridAttributes, HTMLIonGridElement>('ion-grid');
export const IonHeader = createReactComponent<Components.IonHeaderAttributes, HTMLIonHeaderElement>('ion-header');
export const IonImg = createReactComponent<Components.IonImgAttributes, HTMLIonImgElement>('ion-img');
export const IonInfiniteScroll = createReactComponent<Components.IonInfiniteScrollAttributes, HTMLIonInfiniteScrollElement>('ion-infinite-scroll');
export const IonInput = createReactComponent<Components.IonInputAttributes, HTMLIonInputElement>('ion-input');
export const IonItem = createReactComponent<Components.IonItemAttributes, HTMLIonItemElement>('ion-item');
export const IonItemDivider = createReactComponent<Components.IonItemDividerAttributes, HTMLIonItemDividerElement>('ion-item-divider');
export const IonItemGroup = createReactComponent<Components.IonItemGroupAttributes, HTMLIonItemGroupElement>('ion-item-group');
export const IonItemOption = createReactComponent<Components.IonItemOptionAttributes, HTMLIonItemOptionElement>('ion-item-option');
export const IonItemOptions = createReactComponent<Components.IonItemOptionsAttributes, HTMLIonItemOptionsElement>('ion-item-options');
export const IonItemSliding = createReactComponent<Components.IonItemSlidingAttributes, HTMLIonItemSlidingElement>('ion-item-sliding');
export const IonLabel = createReactComponent<Components.IonLabelAttributes, HTMLIonLabelElement>('ion-label');
export const IonList = createReactComponent<Components.IonListAttributes, HTMLIonListElement>('ion-list');
export const IonListHeader = createReactComponent<Components.IonListHeaderAttributes, HTMLIonListHeaderElement>('ion-list-header');
export const IonMenu = createReactComponent<Components.IonMenuAttributes, HTMLIonMenuElement>('ion-menu');
export const IonMenuButton = createReactComponent<Components.IonMenuButtonAttributes, HTMLIonMenuButtonElement>('ion-menu-button');
export const IonMenuToggle = createReactComponent<Components.IonMenuToggleAttributes, HTMLIonMenuToggleElement>('ion-menu-toggle');
export const IonNote = createReactComponent<Components.IonNoteAttributes, HTMLIonNoteElement>('ion-note');
export const IonPicker = createReactComponent<Components.IonPickerAttributes, HTMLIonPickerElement>('ion-picker');
export const IonPickerColumn = createReactComponent<Components.IonPickerColumnAttributes, HTMLIonPickerColumnElement>('ion-picker-column');
export const IonNav = createReactComponent<Components.IonNavAttributes, HTMLIonNavElement>('ion-nav');
export const IonProgressBar = createReactComponent<Components.IonProgressBarAttributes, HTMLIonProgressBarElement>('ion-progress-bar');
export const IonRadio = createReactComponent<Components.IonRadioAttributes, HTMLIonRadioElement>('ion-radio');
export const IonRadioGroup = createReactComponent<Components.IonRadioGroupAttributes, HTMLIonRadioGroupElement>('ion-radio-group');
export const IonRange = createReactComponent<Components.IonRangeAttributes, HTMLIonRangeElement>('ion-range');
export const IonRefresher = createReactComponent<Components.IonRefresherAttributes, HTMLIonRefresherElement>('ion-refresher');
export const IonRefresherContent = createReactComponent<Components.IonRefresherContentAttributes, HTMLIonRefresherContentElement>('ion-refresher-content');
export const IonReorder = createReactComponent<Components.IonReorderAttributes, HTMLIonReorderElement>('ion-reorder');
export const IonReorderGroup = createReactComponent<Components.IonReorderGroupAttributes, HTMLIonReorderGroupElement>('ion-reorder-group');
export const IonRippleEffect = createReactComponent<Components.IonRippleEffectAttributes, HTMLIonRippleEffectElement>('ion-ripple-effect');
export const IonRow = createReactComponent<Components.IonRowAttributes, HTMLIonRowElement>('ion-row');
export const IonSearchbar= createReactComponent<Components.IonSearchbarAttributes, HTMLIonSearchbarElement>('ion-searchbar');
export const IonSegment= createReactComponent<Components.IonSegmentAttributes, HTMLIonSegmentElement>('ion-segment');
export const IonSegmentButton= createReactComponent<Components.IonSegmentButtonAttributes, HTMLIonSegmentButtonElement>('ion-segment-button');
export const IonSelect = createReactComponent<Components.IonSelectAttributes, HTMLIonSelectElement>('ion-select');
export const IonSelectOption = createReactComponent<Components.IonSelectOptionAttributes, HTMLIonSelectOptionElement>('ion-select-option');
export const IonSelectPopover = createReactComponent<Components.IonSelectPopoverAttributes, HTMLIonSelectPopoverElement>('ion-select-popover');
export const IonSkeletonText = createReactComponent<Components.IonSkeletonTextAttributes, HTMLIonSkeletonTextElement>('ion-skeleton-text');
export const IonSlide = createReactComponent<Components.IonSlideAttributes, HTMLIonSlideElement>('ion-slide');
export const IonSlides = createReactComponent<Components.IonSlidesAttributes, HTMLIonSlidesElement>('ion-slides');
export const IonSpinner = createReactComponent<Components.IonSpinnerAttributes, HTMLIonSpinnerElement>('ion-spinner');
export const IonSplitPane = createReactComponent<Components.IonSplitPaneAttributes, HTMLIonSplitPaneElement>('ion-split-pane');
export const IonText = createReactComponent<Components.IonTextAttributes, HTMLIonTextElement>('ion-text');
export const IonTextarea = createReactComponent<Components.IonTextareaAttributes, HTMLIonTextareaElement>('ion-textarea');
export const IonThumbnail = createReactComponent<Components.IonThumbnailAttributes, HTMLIonThumbnailElement>('ion-thumbnail');
export const IonTitle = createReactComponent<Components.IonTitleAttributes, HTMLIonTitleElement>('ion-title');
export const IonToggle = createReactComponent<Components.IonToggleAttributes, HTMLIonToggleElement>('ion-toggle');
export const IonToolbar = createReactComponent<Components.IonToolbarAttributes, HTMLIonToolbarElement>('ion-toolbar');
export const IonVirtualScroll = createReactComponent<Components.IonVirtualScrollAttributes, HTMLIonVirtualScrollElement>('ion-virtual-scroll');
