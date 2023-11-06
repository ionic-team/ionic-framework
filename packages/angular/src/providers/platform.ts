import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, Inject } from '@angular/core';
import { Platform as PlatformBase } from '@ionic/angular/common';
import { isPlatform, getPlatforms } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class Platform extends PlatformBase {
  constructor(@Inject(DOCUMENT) protected doc: any, zone: NgZone) {
    super(doc, zone, isPlatform, getPlatforms);
  }
}
