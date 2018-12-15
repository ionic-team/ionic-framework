import { Components as IoniconsComponents } from 'ionicons';
import { Components } from '@ionic/core';
import { createReactComponent } from './createComponent';

export { default as AlertModal } from './AlertModal';

// TODO:
// ion-action-sheet-controller
// ion-animation-controller
// ion-loading-controller
// ion-menu-controller
// ion-modal-controller
// ion-picker-controller
// ion-popover-controller
// ion-toast-controller
// ion-nav-pop
// ion-nav-push
// ion-nav-set-root
// ion-router
// ion-router-outlet
// ion-route
// ion-route-redirect

export const IonIcon = createReactComponent<IoniconsComponents.IonIconAttributes>('ion-icon');
export const IonApp = createReactComponent<Components.IonAppAttributes>('ion-app');
export const IonPage = createReactComponent<{}>('ion-page');
export const IonMenu = createReactComponent<Components.IonMenuAttributes>('ion-menu');
export const IonHeader = createReactComponent<Components.IonHeaderAttributes>('ion-header');
export const IonTitle = createReactComponent<Components.IonTitleAttributes>('ion-title');
export const IonNav = createReactComponent<Components.IonNavAttributes>('ion-nav');
export const IonToolbar = createReactComponent<Components.IonToolbarAttributes>('ion-toolbar');
export const IonButtons = createReactComponent<Components.IonButtonsAttributes>('ion-buttons');
export const IonSelect = createReactComponent<Components.IonSelectAttributes>('ion-select');
export const IonSelectOption = createReactComponent<Components.IonSelectOptionAttributes>('ion-select-option');
export const IonSelectPopover = createReactComponent<Components.IonSelectPopoverAttributes>('ion-select-popover');
export const IonButton = createReactComponent<Components.IonButtonAttributes>('ion-button');
export const IonContent = createReactComponent<Components.IonContentAttributes>('ion-content');
export const IonList = createReactComponent<Components.IonListAttributes>('ion-list');
export const IonListHeader = createReactComponent<Components.IonListHeaderAttributes>('ion-list-header');
export const IonItem = createReactComponent<Components.IonItemAttributes>('ion-item');
export const IonLabel = createReactComponent<Components.IonLabelAttributes>('ion-label');
export const IonDatetime = createReactComponent<Components.IonDatetimeAttributes>('ion-datetime');
export const IonMenuButton = createReactComponent<Components.IonMenuButtonAttributes>('ion-menu-button');
export const IonItemGroup = createReactComponent<Components.IonItemGroupAttributes>('ion-item-group');
export const IonItemDivider = createReactComponent<Components.IonItemDividerAttributes>('ion-item-divider');
export const IonItemSliding = createReactComponent<Components.IonItemSlidingAttributes>('ion-item-sliding');
export const IonItemOption = createReactComponent<Components.IonItemOptionAttributes>('ion-item-option');
export const IonItemOptions = createReactComponent<Components.IonItemOptionsAttributes>('ion-item-options');
export const IonInput = createReactComponent<Components.IonInputAttributes>('ion-input');
export const IonGrid = createReactComponent<Components.IonGridAttributes>('ion-grid');
export const IonRow = createReactComponent<Components.IonRowAttributes>('ion-row');
export const IonCol = createReactComponent<Components.IonColAttributes>('ion-col');
export const IonSegment= createReactComponent<Components.IonSegmentAttributes>('ion-segment');
export const IonSegmentButton= createReactComponent<Components.IonSegmentButtonAttributes>('ion-segment-button');
export const IonSearchbar= createReactComponent<Components.IonSearchbarAttributes>('ion-searchbar');
export const IonRefresher= createReactComponent<Components.IonRefresherAttributes>('ion-refresher');
export const IonRefresherContent= createReactComponent<Components.IonRefresherContentAttributes>('ion-refresher-content');
export const IonFab= createReactComponent<Components.IonFabAttributes>('ion-fab');
export const IonFabList = createReactComponent<Components.IonFabListAttributes>('ion-fab-list');
export const IonFabButton= createReactComponent<Components.IonFabButtonAttributes>('ion-fab-button');
export const IonAvatar = createReactComponent<Components.IonAvatarAttributes>('ion-avatar');
export const IonCard = createReactComponent<Components.IonCardAttributes>('ion-card');
export const IonCardTitle = createReactComponent<Components.IonCardTitleAttributes>('ion-card-title');
export const IonCardSubtitle = createReactComponent<Components.IonCardSubTitleAttributes>('ion-card-subtitle');
export const IonCardHeader = createReactComponent<Components.IonCardHeaderAttributes>('ion-card-header');
export const IonCardContent = createReactComponent<Components.IonCardContentAttributes>('ion-card-content');
export const IonTextarea = createReactComponent<Components.IonTextareaAttributes>('ion-textarea');
export const IonTabs = createReactComponent<Components.IonTabsAttributes>('ion-tabs');
export const IonTab = createReactComponent<Components.IonTabAttributes>('ion-tab');
export const IonTabBar = createReactComponent<Components.IonTabBarAttributes>('ion-tab-bar');
export const IonTabButton = createReactComponent<Components.IonTabButtonAttributes>('ion-tab-button');
export const IonSlides = createReactComponent<Components.IonSlidesAttributes>('ion-slides');
export const IonSlide = createReactComponent<Components.IonSlideAttributes>('ion-slide');
export const IonSplitPane = createReactComponent<Components.IonSplitPaneAttributes>('ion-split-pane');
export const IonMenuToggle = createReactComponent<Components.IonMenuToggleAttributes>('ion-menu-toggle');
export const IonBadge = createReactComponent<Components.IonBadgeAttributes>('ion-badge');
export const IonAnchor = createReactComponent<Components.IonAnchorAttributes>('ion-anchor');
export const IonBackButton = createReactComponent<Components.IonBackButtonAttributes>('ion-back-button');
export const IonBackdrop = createReactComponent<Components.IonBackdropAttributes>('ion-backdrop');
export const IonCheckbox = createReactComponent<Components.IonCheckboxAttributes>('ion-checkbox');
export const IonChip = createReactComponent<Components.IonChipAttributes>('ion-chip');
export const IonFooter = createReactComponent<Components.IonFooterAttributes>('ion-footer');
export const IonImg = createReactComponent<Components.IonImgAttributes>('ion-img');
export const IonInfiniteScroll = createReactComponent<Components.IonInfiniteScrollAttributes>('ion-infinite-scroll');
export const IonInfiniteScrollContent = createReactComponent<Components.IonInfiniteScrollContentAttributes>('ion-infinite-scroll-content');
export const IonProgressBar = createReactComponent<Components.IonProgressBarAttributes>('ion-progress-bar');
export const IonSkeletonText = createReactComponent<Components.IonSkeletonTextAttributes>('ion-skeleton-text');
export const IonSpinner = createReactComponent<Components.IonSpinnerAttributes>('ion-spinner');
export const IonText = createReactComponent<Components.IonTextAttributes>('ion-text');
export const IonThumbnail = createReactComponent<Components.IonThumbnail>('ion-thumbnail');
export const IonToggle = createReactComponent<Components.IonToggleAttributes>('ion-toggle');
export const IonVirtualScroll = createReactComponent<Components.IonVirtualScroll>('ion-virtual-scroll');
export const IonReorder = createReactComponent<Components.IonReorderAttributes>('ion-reorder');
export const IonReorderGroup = createReactComponent<Components.IonReorderGroupAttributes>('ion-reorder-group');
export const IonRippleEffect = createReactComponent<Components.IonRippleEffect>('ion-ripple-effect');
export const IonNote = createReactComponent<Components.IonNoteAttributes>('ion-note');
export const IonRadio = createReactComponent<Components.IonRadioAttributes>('ion-radio');
export const IonRadioGroup = createReactComponent<Components.IonRadioGroupAttributes>('ion-radio-group');
export const IonRange = createReactComponent<Components.IonRangeAttributes>('ion-range');
