import { Toggle } from '../toggle';
import { mockConfig, mockPlatform, mockHaptic, mockElementRef, mockGestureController, mockRenderer, mockItem, mockForm, mockZone } from '../../../util/mock-providers';
import { commonInputTest, BOOLEAN_CORPUS } from '../../../util/input-tester';

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
