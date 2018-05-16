import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { appInitialize } from './app-initialize';
import { ConfigToken } from './providers/config';
import * as c from './directives';
import * as d from './directives/proxies';
import * as p from './providers';


const DECLARATIONS = [
  // proxies
  d.App,
  d.Avatar,
  d.BackButton,
  d.Badge,
  d.Button,
  d.Buttons,
  d.Card,
  d.CardContent,
  d.CardHeader,
  d.CardSubtitle,
  d.CardTitle,
  d.Checkbox,
  d.Chip,
  d.ChipButton,
  d.Col,
  d.Content,
  d.Datetime,
  d.Fab,
  d.FabButton,
  d.FabList,
  d.Footer,
  d.Grid,
  d.Header,
  d.HideWhen,
  d.Img,
  d.InfiniteScroll,
  d.InfiniteScrollContent,
  d.Input,
  d.Item,
  d.ItemDivider,
  d.ItemGroup,
  d.ItemOption,
  d.ItemOptions,
  d.ItemSliding,
  d.Label,
  d.List,
  d.ListHeader,
  d.Menu,
  d.MenuButton,
  d.MenuToggle,
  d.Nav,
  d.NavPop,
  d.NavPush,
  d.NavSetRoot,
  d.Note,
  d.Radio,
  d.RadioGroup,
  d.Range,
  d.Refresher,
  d.RefresherContent,
  d.Reorder,
  d.ReorderGroup,
  d.RippleEffect,
  d.Row,
  d.Scroll,
  d.Searchbar,
  d.Segment,
  d.SegmentButton,
  d.Select,
  d.SelectOption,
  d.SelectPopover,
  d.ShowWhen,
  d.SkeletonText,
  d.Slide,
  d.Slides,
  d.Spinner,
  d.SplitPane,
  d.Tab,
  d.Tabs,
  d.Text,
  d.Textarea,
  d.Thumbnail,
  d.Toggle,
  d.Toolbar,
  d.ToolbarTitle,

  // custom proxy
  c.Icon,

  // ngModel accessors
  c.BooleanValueAccessor,
  c.NumericValueAccessor,
  c.RadioValueAccessor,
  c.SelectValueAccessor,
  c.TextValueAccessor,

  // navigation
  c.IonBackButton,
  c.IonRouterOutlet,
  c.RouterDirection,
  c.NavDelegate,
  c.TabDelegate,
  c.TabsDelegate,
  c.HrefDelegate,

  // virtual scroll
  c.VirtualFooter,
  c.VirtualHeader,
  c.VirtualItem,
  c.VirtualScroll
];

const PROVIDERS = [
  p.ActionSheetController,
  p.AlertController,
  p.Config,
  p.LoadingController,
  p.PickerController,
  p.ToastController,
  p.MenuController,
  p.NavController,
  p.Platform,
  p.Events,
  p.DomController
];


@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  providers: [p.AngularDelegate, p.ModalController, p.PopoverController],
  imports: [CommonModule]
})
export class IonicModule {
  static forRoot(config?: { [key: string]: any }): ModuleWithProviders {
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
        },
        ...PROVIDERS
      ]
    };
  }
}
