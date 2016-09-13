import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ActionSheetCmp } from './components/action-sheet/action-sheet-component';
import { AlertCmp } from './components/alert/alert-component';
import { IONIC_DIRECTIVES } from './directives';
import { IonicApp } from './components/app/app-root';
import { ionicProviders } from './providers';
import { LoadingCmp } from './components/loading/loading-component';
import { ModalCmp } from './components/modal/modal-component';
import { PickerCmp } from './components/picker/picker-component';
import { PopoverCmp } from './components/popover/popover-component';
import { ToastCmp } from './components/toast/toast-component';


@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule],
  exports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, IONIC_DIRECTIVES],
  declarations: [
    ActionSheetCmp,
    AlertCmp,
    IONIC_DIRECTIVES,
    LoadingCmp,
    ModalCmp,
    PickerCmp,
    PopoverCmp,
    ToastCmp
  ],
  entryComponents: [
    ActionSheetCmp,
    AlertCmp,
    IonicApp,
    LoadingCmp,
    ModalCmp,
    PickerCmp,
    PopoverCmp,
    ToastCmp
  ]
})
export class IonicModule {

  static forRoot(userAppRoot: any, userConfig?: any, userDeepLinkConfig?: any): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: ionicProviders(userAppRoot, userConfig, userDeepLinkConfig)
    };
  }

}
