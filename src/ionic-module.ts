import { ApplicationRef, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicApp } from './components/app/app-root';
import { IONIC_DIRECTIVES } from './directives';
import { ionicProviders } from './providers';


@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  exports: [BrowserModule, FormsModule, ReactiveFormsModule, IONIC_DIRECTIVES, IonicApp],
  declarations: [IONIC_DIRECTIVES, IonicApp]
})
export class IonicModule {

  static forRoot(NOTNEEDED?: any, userConfig?: any, deepLinks?: any[]): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: ionicProviders(userConfig, deepLinks)
    };
  }

}
