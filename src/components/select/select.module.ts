import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Select } from './select';
import { SelectPopover } from './select-popover-component';

import { ItemModule } from '../item/item.module';
import { LabelModule } from '../label/label.module';
import { ListModule } from '../list/list.module';
import { RadioModule } from '../radio/radio.module';


/** @hidden */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemModule,
    LabelModule,
    ListModule,
    RadioModule
  ],
  declarations: [
    Select,
    SelectPopover
  ],
  exports: [
    Select,
    SelectPopover
  ],
  entryComponents: [
    SelectPopover
  ]
})
export class SelectModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SelectModule, providers: []
    };
  }
}
