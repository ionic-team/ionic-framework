
import { BaseInput } from '../base-input';
import { Form } from '../form';
import { Item } from '../../components/item/item';
import { ANY_CORPUS, commonInputTest } from '../input-tester';
import { mockConfig, mockElementRef, mockForm, mockPlatform, mockRenderer } from '../mock-providers';

let platform: any;
let config: any;
let elementRef: any;
let renderer: any;

describe('BaseInput', () => {

  it('should initialize', () => {
    const input = mockInput(null, null, null);

    expect(input._init).toBeFalsy();
    expect(input._isFocus).toBeFalsy();
    expect(input._config).toEqual(config);
    expect(input._elementRef).toEqual(elementRef);

    expect(input._renderer).toEqual(renderer);
    expect(input._componentName).toEqual('input');

    expect(input.id).toBeUndefined();
    expect(input._labelId).toBeUndefined();
  });

  it('should configure with item', () => {
    const form = new Form();
    const item = new Item(form, config, elementRef, renderer, null);
    const input = mockInput(form, item, null);

    expect(input.id).toEqual('input-0-0');
    expect(input._labelId).toEqual('lbl-0');
  });

  it('should pass base test', () => {
    const input = mockInput(mockForm(), null, null);
    commonInputTest(input, {
      defaultValue: null,
      corpus: ANY_CORPUS
    });
  });

});

function mockInput(form: any, item: any, ngControl: any): BaseInput<any> {
  platform = mockPlatform();
  config = mockConfig(null, '/', platform);
  elementRef = mockElementRef();
  renderer = mockRenderer();
  return new BaseInput(config, elementRef, renderer, 'input', null, form, item, ngControl);
}
