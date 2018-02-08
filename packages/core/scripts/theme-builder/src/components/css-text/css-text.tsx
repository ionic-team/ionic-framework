import { Component, Element, Prop }                                from '@stencil/core';
import { deleteCssUrl, getThemeUrl, saveCssUrl, STORED_THEME_KEY } from '../helpers';


@Component({
  tag: 'css-text',
  styleUrl: 'css-text.css'
})
export class CssText {

  @Element() el: HTMLElement;
  @Prop() themeName: string;
  @Prop() cssText: string;

  submitUpdate (ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.saveCss(this.themeName, this.cssText);
  }

  saveCss (themeName: string, cssText: string) {
    const url = saveCssUrl(themeName, cssText);

    fetch(url).then(rsp => {
      return rsp.text().then(txt => {
        console.log('theme server response:', txt);
      });
    }).catch(err => {
      console.log(err);
    });
  }

  createNew (ev: UIEvent) {
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

  deleteTheme (ev: UIEvent) {
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
      <h1>
        {getThemeUrl(this.themeName)}
      </h1>,
      <div>
        <textarea readOnly spellcheck="false">{this.cssText}</textarea>
      </div>,
      <div>
        <button type="button" onClick={this.submitUpdate.bind(this)}>Save Theme</button>
        <button type="button" onClick={this.createNew.bind(this)}>Create</button>
        <button type="button" onClick={this.deleteTheme.bind(this)}>Delete</button>
      </div>
    ];
  }
}
