import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[padding], [padding-top], [padding-bottom], [padding-start], [padding-end], [padding-vertical], [padding-horizontal], [no-margin], [margin], [margin-top], [margin-bottom], [margin-start], [margin-end], [margin-vertical], [margin-horizontal]',
})
export class CssUtilsDeprecations {
  constructor(ref: ElementRef) {
    const el = (ref.nativeElement as HTMLElement);
    const attributes = Array.from(el.attributes)
      .map(a => a.name)
      .filter(n => DEPRECATED_ATTRIBUTES.includes(n));

    if (attributes.length > 0) {
      console.warn(`Ionic CSS attributes are deprecated.
Replace:
'<${el.tagName.toLowerCase()} ${attributes.map(n => `${n}`).join(' ')}>'

With:
'<${el.tagName.toLowerCase()} class="${attributes.map(n => `ion-${n}`).join(' ')}">'
      `);
    }
  }
}
const DEPRECATED_ATTRIBUTES = [
  'padding',
  'padding-top',
  'padding-bottom',
  'padding-start',
  'padding-end',
  'padding-vertical',
  'padding-horizontal',
  'no-margin',
  'margin',
  'margin-top',
  'margin-bottom',
  'margin-start',
  'margin-end',
  'margin-vertical',
  'margin-horizontal'
];
