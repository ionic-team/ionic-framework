import { ApplicationRef, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { IonicApp } from './components/app/app-root';
import { IONIC_DIRECTIVES } from './directives';
import { ionicProviders } from './providers';


@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule],
  exports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, IONIC_DIRECTIVES],
  declarations: [IONIC_DIRECTIVES],
  entryComponents: [IonicApp]
})
export class IonicModule {

  static forRoot(userAppRoot?: any, userConfig?: any, userDeepLinkConfig?: any[]): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: ionicProviders(userAppRoot, userConfig, userDeepLinkConfig)
    };
  }

}
