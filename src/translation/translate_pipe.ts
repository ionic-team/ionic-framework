import {Injectable, Pipe, PipeTransform} from '@angular/core';

import {Translate} from './translate';

/**
 * @private
 * The Translate pipe makes it easy to translate strings.
 *
 * @usage
 * Translate using the current language or language set through Translate.setLanguage
 * {{ 'Please enter your location' | translate }}
 *
 * Translate using a specific language
 * {{ 'Please enter your location' | translate:"de" }}
 */
@Pipe({name: 'translate'})
@Injectable()
export class TranslatePipe implements PipeTransform {
  private translate: any = {};

  constructor(translate: Translate) {
    this.translate = translate;
  }
  transform(value, lang) {
    return this.translate.translate(value, lang);
  }

  supports(obj) { return true; }
}
