import { async, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {TextInput} from '../input';
import {AppModule} from './app-module';

import {DomElementSchemaRegistry} from '@angular/compiler/src/schema/dom_element_schema_registry';

describe('TextInput', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(AppModule);
    TestBed.compileComponents();
  }));

  let inp_attrs = {
    autocomplete: 'foo',
    autocorrect: 'foo',
    autocapitalize: 'foo',
    list: 'foo',
    name: 'foo',
    max: 123,
    maxlength: 123,
    min: 123,
    minlength: 123,
    step: 123,
    tabindex: 123,
    autofocus: true,
    readonly: true,
    required: true,
    spellcheck: true,
    disabled: true,
  };

  let textarea_attrs = {
    autocomplete: 'foo',
    autocapitalize: 'foo',
    name: 'foo',
    maxlength: 123,
    minlength: 123,
    autofocus: true,
    readonly: true,
    required: true,
    spellcheck: true,
    disabled: true,
  };

  for (let k of inp_attrs) {
    let v = inp_attrs[k];
    it(`supports the ${k} attribute`, () => {
      let fixture = TestBed.createComponent(TextInput);
      let input: TextInput = fixture.debugElement.query(By.css('#attr_inp')).componentInstance;
      console.log('input', input);
      let el: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      console.log('el', el);
      fixture.detectChanges();
      expect(el.getAttribute(k)).toEqual(null);
      input[k] = v.toString();
      fixture.detectChanges();
      expect(el.getAttribute(k)).toEqual(v);
    });
  }

);

describe('DOMElementSchema', () => {
  let registry: DomElementSchemaRegistry;
  beforeEach(() => {
    registry = new DomElementSchemaRegistry();
  });

  it('should detect properties on regular elements', () => {
    expect(registry.hasProperty('input', 'autocomplete', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'autocorrect', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'autocapitalize', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'autofocus', [])).toBeTruthy();
    expect(registry.hasProperty('input', 'disabled', [])).toBeTruthy();
    expect(registry.hasProperty('input', 'list', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'max', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'maxlength', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'min', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'minlength', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'readonly', [])).toBeTruthy();
    expect(registry.hasProperty('input', 'required', [])).toBeTruthy();
    expect(registry.hasProperty('input', 'spellcheck', [])).toBeTruthy();
    expect(registry.hasProperty('input', 'step', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'tabindex', [])).toBeFalsy();
    expect(registry.hasProperty('input', 'name', [])).toBeFalsy();
  });

};
