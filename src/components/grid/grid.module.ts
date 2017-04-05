import { NgModule, ModuleWithProviders } from '@angular/core';

import { Grid } from './grid';
import { Row } from './row';
import { Col } from './col';

/** @hidden */
@NgModule({
  declarations: [
    Grid,
    Row,
    Col
  ],
  exports: [
    Grid,
    Row,
    Col
  ]
})
export class GridModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: GridModule, providers: []
    };
  }
}
