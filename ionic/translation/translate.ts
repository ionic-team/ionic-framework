import {Injectable} from 'angular2/angular2';

@Injectable()
export class Translate {
  constructor() {
    this._transMap = {};
  }

  translations(lang, map) {
    this._transMap[lang] = map;
  }

  setLanguage(lang) {
    this._language = lang;
  }

  getTranslations(lang) {
    return this._transMap[lang];
  }

  translate(lang, key) {
    // If called with just one param, first is the key
    if(typeof key === 'undefined') {
      key = lang;
      lang = this._language;
    }

    // If the language isn't specified, return the string passed.
    if(!lang) {
      return key;
    }

    let map = this.getTranslations(lang);

    if(!map) {
      console.warn('I18N: No translation for key', key, 'using language', this._language);
      return '';
    }
    return this._getTranslation(map, key);
  }

  _getTranslation(map, key) {
    return map && map[key] || '';
  }
}
