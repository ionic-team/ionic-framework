import { ANALYZE_FOR_ENTRY_COMPONENTS, ApplicationRef, NgModule, Optional } from '@angular/core';
import { ModuleWithProviders, OpaqueToken, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoot } from './components/app/app'
import { IONIC_COMPONENTS, IONIC_DIRECTIVES } from './directives'
import { ionicProviders } from './config/providers'


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

  static forRoot(userRoot: any, config?: any): ModuleWithProviders {
    return {
      ngModule: IonicModule,
      providers: [
        ionicProviders(config),
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: userRoot,
          multi: true
        },
        {
          provide: AppRoot.userComponent,
          useValue: userRoot
        },
      ]
    };
  }

}
