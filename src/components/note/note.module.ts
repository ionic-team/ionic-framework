import { NgModule, ModuleWithProviders } from '@angular/core';

import { Note } from './note';

/** @hidden */
@NgModule({
  declarations: [
    Note
  ],
  exports: [
    Note
  ]
})
export class NoteModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NoteModule, providers: []
    };
  }
}
