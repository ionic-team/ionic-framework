import { addIcons } from 'ionicons';
import { ICON_PATHS } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/core/loader';
import { Components as IoniconsComponents } from 'ionicons';
import { Components } from '@ionic/core';
import { createReactComponent } from './createComponent';
import { ReactProps } from './ReactProps';
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
export const IonIcon = createReactComponent<IoniconsComponents.IonIconAttributes & ReactProps, HTMLIonIconElement>('ion-icon');

// createReactComponent
export const IonTabBarInner = createReactComponent<Components.IonTabBarAttributes & ReactProps, HTMLIonTabBarElement>('ion-tab-bar');
export const IonRouterOutletInner = createReactComponent<Components.IonRouterOutletAttributes & ReactProps, HTMLIonRouterOutletElement>('ion-router-outlet');
export const IonBackButtonInner = createReactComponent<Components.IonBackButtonAttributes & ReactProps, HTMLIonBackButtonElement>('ion-back-button');
export const IonTab = createReactComponent<Components.IonTabAttributes & ReactProps, HTMLIonTabElement>('ion-tab');
export const IonTabButton = createReactComponent<Components.IonTabButtonAttributes & ReactProps, HTMLIonTabButtonElement>('ion-tab-button');
export const IonAnchor = createReactComponent<Components.IonAnchorAttributes & ReactProps, HTMLIonAnchorElement>('ion-anchor');
export const IonApp = createReactComponent<Components.IonAppAttributes & ReactProps, HTMLIonAppElement>('ion-app');
export const IonAvatar = createReactComponent<Components.IonAvatarAttributes & ReactProps, HTMLIonAvatarElement>('ion-avatar');
export const IonBackdrop = createReactComponent<Components.IonBackdropAttributes & ReactProps, HTMLIonBackdropElement>('ion-backdrop');
export const IonBadge = createReactComponent<Components.IonBadgeAttributes & ReactProps, HTMLIonBadgeElement>('ion-badge');
export const IonButton = createReactComponent<Components.IonButtonAttributes & ReactProps, HTMLIonButtonElement>('ion-button');
export const IonButtons = createReactComponent<Components.IonButtonsAttributes & ReactProps, HTMLIonButtonsElement>('ion-buttons');
export const IonCard = createReactComponent<Components.IonCardAttributes & ReactProps, HTMLIonCardElement>('ion-card');
export const IonCardContent = createReactComponent<Components.IonCardContentAttributes & ReactProps, HTMLIonCardContentElement>('ion-card-content');
export const IonCardHeader = createReactComponent<Components.IonCardHeaderAttributes & ReactProps, HTMLIonCardHeaderElement>('ion-card-header');
export const IonCardSubtitle = createReactComponent<Components.IonCardSubtitleAttributes & ReactProps, HTMLIonCardSubtitleElement>('ion-card-subtitle');
export const IonCardTitle = createReactComponent<Components.IonCardTitleAttributes & ReactProps, HTMLIonCardTitleElement>('ion-card-title');
export const IonCheckbox = createReactComponent<Components.IonCheckboxAttributes & ReactProps, HTMLIonCheckboxElement>('ion-checkbox');
export const IonCol = createReactComponent<Components.IonColAttributes & ReactProps, HTMLIonColElement>('ion-col');
export const IonContent = createReactComponent<Components.IonContentAttributes & ReactProps, HTMLIonContentElement>('ion-content');
export const IonChip = createReactComponent<Components.IonChipAttributes & ReactProps, HTMLIonChipElement>('ion-chip');
export const IonDatetime = createReactComponent<Components.IonDatetimeAttributes & ReactProps, HTMLIonDatetimeElement>('ion-datetime');
export const IonFab= createReactComponent<Components.IonFabAttributes & ReactProps, HTMLIonFabElement>('ion-fab');
export const IonFabButton= createReactComponent<Components.IonFabButtonAttributes & ReactProps, HTMLIonFabButtonElement>('ion-fab-button');
export const IonFabList = createReactComponent<Components.IonFabListAttributes & ReactProps, HTMLIonFabListElement>('ion-fab-list');
export const IonFooter = createReactComponent<Components.IonFooterAttributes & ReactProps, HTMLIonFooterElement>('ion-footer');
export const IonGrid = createReactComponent<Components.IonGridAttributes & ReactProps, HTMLIonGridElement>('ion-grid');
export const IonHeader = createReactComponent<Components.IonHeaderAttributes & ReactProps, HTMLIonHeaderElement>('ion-header');
export const IonImg = createReactComponent<Components.IonImgAttributes & ReactProps, HTMLIonImgElement>('ion-img');
export const IonInfiniteScroll = createReactComponent<Components.IonInfiniteScrollAttributes & ReactProps, HTMLIonInfiniteScrollElement>('ion-infinite-scroll');
export const IonInput = createReactComponent<Components.IonInputAttributes & ReactProps, HTMLIonInputElement>('ion-input');
export const IonItem = createReactComponent<Components.IonItemAttributes & ReactProps, HTMLIonItemElement>('ion-item');
export const IonItemDivider = createReactComponent<Components.IonItemDividerAttributes & ReactProps, HTMLIonItemDividerElement>('ion-item-divider');
export const IonItemGroup = createReactComponent<Components.IonItemGroupAttributes & ReactProps, HTMLIonItemGroupElement>('ion-item-group');
export const IonItemOption = createReactComponent<Components.IonItemOptionAttributes & ReactProps, HTMLIonItemOptionElement>('ion-item-option');
export const IonItemOptions = createReactComponent<Components.IonItemOptionsAttributes & ReactProps, HTMLIonItemOptionsElement>('ion-item-options');
export const IonItemSliding = createReactComponent<Components.IonItemSlidingAttributes & ReactProps, HTMLIonItemSlidingElement>('ion-item-sliding');
export const IonLabel = createReactComponent<Components.IonLabelAttributes & ReactProps, HTMLIonLabelElement>('ion-label');
export const IonList = createReactComponent<Components.IonListAttributes & ReactProps, HTMLIonListElement>('ion-list');
export const IonListHeader = createReactComponent<Components.IonListHeaderAttributes & ReactProps, HTMLIonListHeaderElement>('ion-list-header');
export const IonMenu = createReactComponent<Components.IonMenuAttributes & ReactProps, HTMLIonMenuElement>('ion-menu');
export const IonMenuButton = createReactComponent<Components.IonMenuButtonAttributes & ReactProps, HTMLIonMenuButtonElement>('ion-menu-button');
export const IonMenuToggle = createReactComponent<Components.IonMenuToggleAttributes & ReactProps, HTMLIonMenuToggleElement>('ion-menu-toggle');
export const IonNote = createReactComponent<Components.IonNoteAttributes & ReactProps, HTMLIonNoteElement>('ion-note');
export const IonPicker = createReactComponent<Components.IonPickerAttributes & ReactProps, HTMLIonPickerElement>('ion-picker');
export const IonPickerColumn = createReactComponent<Components.IonPickerColumnAttributes & ReactProps, HTMLIonPickerColumnElement>('ion-picker-column');
export const IonNav = createReactComponent<Components.IonNavAttributes & ReactProps, HTMLIonNavElement>('ion-nav');
export const IonProgressBar = createReactComponent<Components.IonProgressBarAttributes & ReactProps, HTMLIonProgressBarElement>('ion-progress-bar');
export const IonRadio = createReactComponent<Components.IonRadioAttributes & ReactProps, HTMLIonRadioElement>('ion-radio');
export const IonRadioGroup = createReactComponent<Components.IonRadioGroupAttributes & ReactProps, HTMLIonRadioGroupElement>('ion-radio-group');
export const IonRange = createReactComponent<Components.IonRangeAttributes & ReactProps, HTMLIonRangeElement>('ion-range');
export const IonRefresher = createReactComponent<Components.IonRefresherAttributes & ReactProps, HTMLIonRefresherElement>('ion-refresher');
export const IonRefresherContent = createReactComponent<Components.IonRefresherContentAttributes & ReactProps, HTMLIonRefresherContentElement>('ion-refresher-content');
export const IonReorder = createReactComponent<Components.IonReorderAttributes & ReactProps, HTMLIonReorderElement>('ion-reorder');
export const IonReorderGroup = createReactComponent<Components.IonReorderGroupAttributes & ReactProps, HTMLIonReorderGroupElement>('ion-reorder-group');
export const IonRippleEffect = createReactComponent<Components.IonRippleEffectAttributes & ReactProps, HTMLIonRippleEffectElement>('ion-ripple-effect');
export const IonRow = createReactComponent<Components.IonRowAttributes & ReactProps, HTMLIonRowElement>('ion-row');
export const IonSearchbar= createReactComponent<Components.IonSearchbarAttributes & ReactProps, HTMLIonSearchbarElement>('ion-searchbar');
export const IonSegment= createReactComponent<Components.IonSegmentAttributes & ReactProps, HTMLIonSegmentElement>('ion-segment');
export const IonSegmentButton= createReactComponent<Components.IonSegmentButtonAttributes & ReactProps, HTMLIonSegmentButtonElement>('ion-segment-button');
export const IonSelect = createReactComponent<Components.IonSelectAttributes & ReactProps, HTMLIonSelectElement>('ion-select');
export const IonSelectOption = createReactComponent<Components.IonSelectOptionAttributes & ReactProps, HTMLIonSelectOptionElement>('ion-select-option');
export const IonSelectPopover = createReactComponent<Components.IonSelectPopoverAttributes & ReactProps, HTMLIonSelectPopoverElement>('ion-select-popover');
export const IonSkeletonText = createReactComponent<Components.IonSkeletonTextAttributes & ReactProps, HTMLIonSkeletonTextElement>('ion-skeleton-text');
export const IonSlide = createReactComponent<Components.IonSlideAttributes & ReactProps, HTMLIonSlideElement>('ion-slide');
export const IonSlides = createReactComponent<Components.IonSlidesAttributes & ReactProps, HTMLIonSlidesElement>('ion-slides');
export const IonSpinner = createReactComponent<Components.IonSpinnerAttributes & ReactProps, HTMLIonSpinnerElement>('ion-spinner');
export const IonSplitPane = createReactComponent<Components.IonSplitPaneAttributes & ReactProps, HTMLIonSplitPaneElement>('ion-split-pane');
export const IonText = createReactComponent<Components.IonTextAttributes & ReactProps, HTMLIonTextElement>('ion-text');
export const IonTextarea = createReactComponent<Components.IonTextareaAttributes & ReactProps, HTMLIonTextareaElement>('ion-textarea');
export const IonThumbnail = createReactComponent<Components.IonThumbnailAttributes & ReactProps, HTMLIonThumbnailElement>('ion-thumbnail');
export const IonTitle = createReactComponent<Components.IonTitleAttributes & ReactProps, HTMLIonTitleElement>('ion-title');
export const IonToggle = createReactComponent<Components.IonToggleAttributes & ReactProps, HTMLIonToggleElement>('ion-toggle');
export const IonToolbar = createReactComponent<Components.IonToolbarAttributes & ReactProps, HTMLIonToolbarElement>('ion-toolbar');
export const IonVirtualScroll = createReactComponent<Components.IonVirtualScrollAttributes & ReactProps, HTMLIonVirtualScrollElement>('ion-virtual-scroll');
