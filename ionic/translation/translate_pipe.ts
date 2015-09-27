import {Injectable, Pipe, PipeTransform} from 'angular2/angular2';

import {Translate} from './translate';

/**
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
  constructor(translate: Translate) {
    this.translate = translate;
  }
  transform(value, args) {
    let lang;
    if(args.length > 0) {
      lang = args[0];
    }
    return this.translate.translate(value, lang);
  }

  supports(obj) { return true; }
}
