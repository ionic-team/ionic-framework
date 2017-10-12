import { Toggle } from '../toggle';
import { mockConfig, mockElementRef, mockForm, mockGestureController, mockHaptic, mockItem, mockPlatform, mockRenderer, mockZone } from '../../../util/mock-providers';
import { BOOLEAN_CORPUS, commonInputTest } from '../../../util/input-tester';

describe('Toggle', () => {

  it('should pass common test', () => {

    const platform = mockPlatform();
    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    const item: any = mockItem();
    const form = mockForm();
    const haptic = mockHaptic();
    const gesture = mockGestureController();
    const zone = mockZone();
    const toggle = new Toggle(form, config, platform, elementRef, renderer, haptic, item, gesture, null, zone);

    commonInputTest(toggle, {
      defaultValue: false,
      corpus: BOOLEAN_CORPUS,
    });

  });

});
