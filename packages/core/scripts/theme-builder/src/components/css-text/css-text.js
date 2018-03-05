var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import {Component, Prop} from '@stencil/core';
import {deleteCssUrl, getThemeUrl, saveCssUrl, STORED_THEME_KEY} from '../helpers';

let CssText = class CssText {
  submitUpdate (ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.saveCss(this.themeName, this.cssText);
  }

  saveCss (themeName, cssText) {
    const url = saveCssUrl(themeName, cssText);
    fetch(url).then(rsp => {
      return rsp.text().then(txt => {
        console.log('theme server response:', txt);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  createNew (ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const name = prompt(`New theme name:`);
    if (name) {
      const themeName = name.split('.')[0].trim().toLowerCase();
      if (themeName.length) {
        console.log('createNew themeName', themeName);
        localStorage.setItem(STORED_THEME_KEY, themeName);
        this.saveCss(themeName, this.cssText);
      }
    }
  }

  deleteTheme (ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const shouldDelete = confirm(`Sure you want to delete "${this.themeName}"?`);
    if (shouldDelete) {
      const url = deleteCssUrl(this.themeName);
      fetch(url).then(rsp => {
        return rsp.text().then(txt => {
          console.log('theme server response:', txt);
        });
      }).catch(err => {
        console.log(err);
      });
      localStorage.removeItem(STORED_THEME_KEY);
    }
  }

  render () {
    return [
      h("h1", null, getThemeUrl(this.themeName)),
      h("div", null,
        h("textarea", {readOnly: true, spellcheck: 'false'}, this.cssText)),
      h("div", null,
        h("button", {type: 'button', onClick: this.submitUpdate.bind(this)}, "Save Theme"),
        h("button", {type: 'button', onClick: this.createNew.bind(this)}, "Create"),
        h("button", {type: 'button', onClick: this.deleteTheme.bind(this)}, "Delete"))
    ];
  }
};
__decorate([
  Prop()
], CssText.prototype, "themeName", void 0);
__decorate([
  Prop()
], CssText.prototype, "cssText", void 0);
CssText = __decorate([
  Component({
    tag: 'css-text',
    styleUrl: 'css-text.css',
    shadow: true
  })
], CssText);
export {CssText};
