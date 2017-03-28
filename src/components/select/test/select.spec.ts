
import { Select } from '../select';
import { mockApp, mockConfig, mockElementRef, mockRenderer, mockItem, mockForm } from '../../../util/mock-providers';
import { commonInputTest } from '../../../util/input-tester';

describe('Select', () => {

  it('should pass common test', () => {

    const app = mockApp();
    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    const item: any = mockItem();
    const form = mockForm();
    const select = new Select(app, form, config, elementRef, renderer, item, null);

    commonInputTest(select, {
      defaultValue: [],
      corpus: [
        [['hola'], ['hola']],
        [null, []],
        ['hola', ['hola']],
        [['hola', 'adios'], ['hola', 'adios']]
      ]
    });

  });

});
