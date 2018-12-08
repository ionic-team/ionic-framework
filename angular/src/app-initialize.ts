import * as c from '@ionic/core/loader';
import { Config } from './providers/config';
import { IonicWindow } from './types/interfaces';

// Webpack import for ionicons
// @ts-ignore
// tslint:disable-next-line:no-import-side-effect
import '@ionic/core/dist/ionic/svg';

export function appInitialize(config: Config) {
  return () => {
    const win: IonicWindow = window as any;
    if (typeof win !== 'undefined') {
      const Ionic = win.Ionic = win.Ionic || {};

      Ionic.config = config;
      Ionic.asyncQueue = false;

      Ionic.ael = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__addEventListener && skipZone(eventName)) {
          elm.__zone_symbol__addEventListener(eventName, cb, opts);
        } else {
          elm.addEventListener(eventName, cb, opts);
        }
      };

      Ionic.rel = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__removeEventListener && skipZone(eventName)) {
          elm.__zone_symbol__removeEventListener(eventName, cb, opts);
        } else {
          elm.removeEventListener(eventName, cb, opts);
        }
      };

      c.defineCustomElement(win, [
        c.IonActionSheet,
        c.IonActionSheetController,
        c.IonAlert,
        c.IonAlertController,
        c.IonAnchor,
        c.IonAnimationController,
        c.IonApp,
        c.IonAvatar,
        c.IonBackButton,
        c.IonBackdrop,
        c.IonBadge,
        c.IonButton,
        c.IonButtons,
        c.IonCard,
        c.IonCardContent,
        c.IonCardHeader,
        c.IonCardSubtitle,
        c.IonCardTitle,
        c.IonCheckbox,
        c.IonChip,
        c.IonCol,
        c.IonContent,
        c.IonDatetime,
        c.IonFab,
        c.IonFabButton,
        c.IonFabList,
        c.IonFooter,
        c.IonGrid,
        c.IonHeader,
        c.IonIcon,
        c.IonImg,
        c.IonInfiniteScroll,
        c.IonInfiniteScrollContent,
        c.IonInput,
        c.IonItem,
        c.IonItemDivider,
        c.IonItemGroup,
        c.IonItemOption,
        c.IonItemOptions,
        c.IonItemSliding,
        c.IonLabel,
        c.IonList,
        c.IonListHeader,
        c.IonLoading,
        c.IonLoadingController,
        c.IonMenu,
        c.IonMenuButton,
        c.IonMenuController,
        c.IonMenuToggle,
        c.IonModal,
        c.IonModalController,
        c.IonNav,
        c.IonNavPop,
        c.IonNavPush,
        c.IonNavSetRoot,
        c.IonNote,
        c.IonPicker,
        c.IonPickerColumn,
        c.IonPickerController,
        c.IonPopover,
        c.IonPopoverController,
        c.IonRadio,
        c.IonRadioGroup,
        c.IonRange,
        c.IonRefresher,
        c.IonRefresherContent,
        c.IonReorder,
        c.IonReorderGroup,
        c.IonRippleEffect,
        c.IonRoute,
        c.IonRouteRedirect,
        c.IonRouter,
        c.IonRouterOutlet,
        c.IonRow,
        c.IonSearchbar,
        c.IonSegment,
        c.IonSegmentButton,
        c.IonSelect,
        c.IonSelectOption,
        c.IonSelectPopover,
        c.IonSkeletonText,
        c.IonSlide,
        c.IonSlides,
        c.IonSpinner,
        c.IonSplitPane,
        c.IonTabBar,
        c.IonTabButton,
        c.IonText,
        c.IonTextarea,
        c.IonThumbnail,
        c.IonTitle,
        c.IonToast,
        c.IonToastController,
        c.IonToggle,
        c.IonToolbar,
        c.IonVirtualScroll
      ]);
    }
  };
}

const SKIP_ZONE = [
  'scroll',
  'resize',

  'touchstart',
  'touchmove',
  'touchend',

  'mousedown',
  'mousemove',
  'mouseup',

  'ionStyle',
];

function skipZone(eventName: string) {
  return SKIP_ZONE.indexOf(eventName) >= 0;
}
