import { NgModule, ModuleWithProviders } from '@angular/core';

import { Card } from './card';
import { CardContent } from './card-content';
import { CardHeader } from './card-header';
import { CardTitle } from './card-title';

/** @hidden */
@NgModule({
  declarations: [
    Card,
    CardContent,
    CardHeader,
    CardTitle
  ],
  exports: [
    Card,
    CardContent,
    CardHeader,
    CardTitle
  ]
})
export class CardModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CardModule, providers: []
    };
  }
}
