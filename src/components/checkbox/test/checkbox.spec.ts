
import { Checkbox } from '../checkbox';
import { mockConfig, mockElementRef, mockRenderer, mockItem, mockChangeDetectorRef } from '../../../util/mock-providers';
import { commonInputTest, BOOLEAN_CORPUS } from '../../../util/input-tester';

describe('Checkbox', () => {

  it('should pass common test', () => {

    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    const item: any = mockItem();
    const cd = mockChangeDetectorRef();
    const checkbox = new Checkbox(config, null, item, elementRef, renderer, cd);

    commonInputTest(checkbox, {
      defaultValue: false,
      corpus: BOOLEAN_CORPUS
    });

  });

});
