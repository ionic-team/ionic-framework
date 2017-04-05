import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { NativeInput } from './native-input';
import { NextInput } from './next-input';
import { TextInput } from './input';

/** @hidden */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NativeInput,
    NextInput,
    TextInput
  ],
  exports: [
    NativeInput,
    NextInput,
    TextInput
  ]
})
export class InputModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: InputModule, providers: []
    };
  }
}
