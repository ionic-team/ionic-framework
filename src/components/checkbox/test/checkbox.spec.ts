
import { Checkbox } from '../checkbox';
import { mockConfig, mockElementRef, mockItem, mockRenderer } from '../../../util/mock-providers';
import { BOOLEAN_CORPUS, commonInputTest } from '../../../util/input-tester';

describe('Checkbox', () => {

  it('should pass common test', () => {

    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    const item: any = mockItem();
    const checkbox = new Checkbox(config, null, item, elementRef, renderer);

    commonInputTest(checkbox, {
      defaultValue: false,
      corpus: BOOLEAN_CORPUS
    });

  });

});
