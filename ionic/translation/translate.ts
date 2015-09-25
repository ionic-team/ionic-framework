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

  translate(key, lang) {
    // If the language isn't specified and we have no overridden one, return the string passed.
    if(!lang && !this._language) {
      return key;
    }

    let setLanguage = lang || this._language;

    let map = this.getTranslations(setLanguage);

    if(!map) {
      console.warn('I18N: No translation for key', key, 'using language', setLanguage);
      return '';
    }
    return this._getTranslation(map, key);
  }

  _getTranslation(map, key) {
    return map && map[key] || '';
  }
}
