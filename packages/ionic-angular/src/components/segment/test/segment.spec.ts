
import { QueryList } from '@angular/core';
import { Segment } from '../segment';
import { SegmentButton } from '../segment-button';
import { mockConfig, mockElementRef, mockRenderer } from '../../../util/mock-providers';
import { commonInputTest } from '../../../util/input-tester';

describe('Segment', () => {

  it('should pass common test', () => {

    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    const segment = new Segment(config, elementRef, renderer, null);
    segment._buttons = new QueryList<SegmentButton>();

    commonInputTest(segment, {
      defaultValue: null,
      corpus: [
        ['option1', 'option1'],
        ['option2', 'option2'],
        ['option3', 'option3'],
        ['option4', 'option4'],
        ['', ''],
      ]
    });

  });

});
