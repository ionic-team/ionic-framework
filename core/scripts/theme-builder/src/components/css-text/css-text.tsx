import { Component, Element, Prop }                                from '@stencil/core';
import { deleteCssUrl, getThemeUrl, saveCssUrl, STORED_THEME_KEY } from '../helpers';


@Component({
  tag: 'css-text',
  styleUrl: 'css-text.css'
})
export class CssText {

  @Prop() cssText: string;
  @Element() el!: HTMLElement;
  @Prop() themeName: string;

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
      </div>,
      <div class="instructions">
        <h2>Instructions</h2>
        <p>Primary CSS Properties will highlight on hover.</p>
        <p><b>CTRL + Hover: Property</b><br/> Will visibly toggle color in preview.</p>
        <p><b>CTRL + Hover: Preview</b><br/>Will visibly highlight properties used under the mouse.</p>
        <p><b>ALT + Double Click: Primary Property</b><br/>Auto generate steps or shade/tint/contrast
          variations.</p>
      </div>
    ];
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

  submitUpdate (ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.saveCss(this.themeName, this.cssText);
  }
}
