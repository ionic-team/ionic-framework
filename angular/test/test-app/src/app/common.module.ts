import { NgModule } from '@angular/core';

import { LifecyclesLoggerComponent } from './lifecycles-logger/lifecycles-logger.component';

@NgModule({
  declarations: [
    LifecyclesLoggerComponent,
  ],
  exports: [
    LifecyclesLoggerComponent
  ]
})
export class AppCommonModule { }
