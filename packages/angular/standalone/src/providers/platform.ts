import { DOCUMENT, Injectable, NgZone, Inject } from '@angular/core';
import { Platform as PlatformBase } from '@ionic/angular/common';
import { isPlatform, getPlatforms } from '@ionic/core/components';

@Injectable({
  providedIn: 'root',
})
export class Platform extends PlatformBase {
  constructor(@Inject(DOCUMENT) protected doc: any, zone: NgZone) {
    super(doc, zone, isPlatform, getPlatforms);
  }
}
