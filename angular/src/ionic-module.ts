import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { IonicConfig } from '@ionic/core';

import { appInitialize } from './app-initialize';
import * as d from './directives';
import * as p from './providers';
import { ConfigToken } from './providers/config';

const DECLARATIONS = [
  // proxies
  d.IonApp,
  d.IonAvatar,
  d.IonBackButton,
  d.IonBackdrop,
  d.IonBadge,
  d.IonButton,
  d.IonButtons,
  d.IonCard,
  d.IonCardContent,
  d.IonCardHeader,
  d.IonCardSubtitle,
  d.IonCardTitle,
  d.IonCheckbox,
  d.IonChip,
  d.IonCol,
  d.IonContent,
  d.IonDatetime,
  d.IonFab,
  d.IonFabButton,
  d.IonFabList,
  d.IonFooter,
  d.IonGrid,
  d.IonHeader,
  d.IonIcon,
  d.IonImg,
  d.IonInfiniteScroll,
  d.IonInfiniteScrollContent,
  d.IonInput,
  d.IonItem,
  d.IonItemDivider,
  d.IonItemGroup,
  d.IonItemOption,
  d.IonItemOptions,
  d.IonItemSliding,
  d.IonLabel,
  d.IonList,
  d.IonListHeader,
  d.IonMenu,
  d.IonMenuButton,
  d.IonMenuToggle,
  d.IonNav,
  d.IonNavPop,
  d.IonNavPush,
  d.IonNavSetRoot,
  d.IonNote,
  d.IonProgressBar,
  d.IonRadio,
  d.IonRadioGroup,
  d.IonRange,
  d.IonRefresher,
  d.IonRefresherContent,
  d.IonReorder,
  d.IonReorderGroup,
  d.IonRippleEffect,
  d.IonRow,
  d.IonSearchbar,
  d.IonSegment,
  d.IonSegmentButton,
  d.IonSelect,
  d.IonSelectOption,
  d.IonSkeletonText,
  d.IonSlide,
  d.IonSlides,
  d.IonSpinner,
  d.IonSplitPane,
  d.IonTabBar,
  d.IonTabButton,
  d.IonText,
  d.IonTextarea,
  d.IonThumbnail,
  d.IonToggle,
  d.IonToolbar,
  d.IonTitle,

  d.IonTabs,

  // ngModel accessors
  d.BooleanValueAccessor,
  d.NumericValueAccessor,
  d.RadioValueAccessor,
  d.SelectValueAccessor,
  d.TextValueAccessor,

  // navigation
  d.IonRouterOutlet,
  d.IonBackButtonDelegate,
  d.NavDelegate,
  d.RouterLinkDelegate,

  // virtual scroll
  d.VirtualFooter,
  d.VirtualHeader,
  d.VirtualItem,
  d.IonVirtualScroll
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  providers: [p.AngularDelegate, p.ModalController, p.PopoverController],
  imports: [CommonModule]
})
export class IonicModule {
  static forRoot(config?: IonicConfig): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        {
          provide: ConfigToken,
          useValue: config
        },
        {
          provide: APP_INITIALIZER,
          useFactory: appInitialize,
          multi: true,
          deps: [
            ConfigToken
          ]
        }
      ]
    };
  }
}
