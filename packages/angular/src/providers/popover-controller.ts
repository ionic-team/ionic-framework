import { Injectable } from '@angular/core';
import { PopoverController as PopoverControllerBase } from '@ionic/angular/common';
import { popoverController } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class PopoverController extends PopoverControllerBase {
  constructor() {
    super(popoverController);
  }
}
