import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Item } from './item';
import { ItemContent } from './item-content';
import { ItemDivider } from './item-divider';
import { ItemGroup } from './item-group';
import { ItemOptions } from './item-options';
import { ItemReorder } from './item-reorder';
import { ItemSliding } from './item-sliding';
import { Reorder } from './reorder';

import { IconModule } from '../icon/icon.module';
import { LabelModule } from '../label/label.module';

/** @hidden */
@NgModule({
  imports: [
    CommonModule,
    IconModule,
    LabelModule
  ],
  declarations: [
    Item,
    ItemContent,
    ItemDivider,
    ItemGroup,
    ItemOptions,
    ItemReorder,
    ItemSliding,
    Reorder
  ],
  exports: [
    Item,
    ItemContent,
    ItemDivider,
    ItemGroup,
    ItemOptions,
    ItemReorder,
    ItemSliding,
    Reorder
  ]
})
export class ItemModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ItemModule, providers: []
    };
  }
}
