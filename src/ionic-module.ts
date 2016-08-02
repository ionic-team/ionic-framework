import { ApplicationRef, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoot } from './components/app/app-root'
import { IONIC_DIRECTIVES } from './directives'
import { ionicProviders } from './providers'

export {BrowserModule} from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule, FormsModule],
  exports: [BrowserModule, FormsModule, IONIC_DIRECTIVES],
  declarations: [IONIC_DIRECTIVES, AppRoot],
  entryComponents: [AppRoot]
})
export class IonicModule {

  constructor(
    @Optional() @SkipSelf() ionicModule: IonicModule,
    ngAppRef: ApplicationRef
  ) {
    if (!ionicModule) {
      ngAppRef.bootstrap(AppRoot);
    }
  }

  static forRoot(userRoot: any, userConfig?: any, deepLinks?: any[]): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      //providers: []
      providers: ionicProviders(userRoot, userConfig, deepLinks)
    };
  }
}
