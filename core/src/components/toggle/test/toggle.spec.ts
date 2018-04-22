import { TestWindow, spyOnEvent } from '@stencil/core/testing';
import { Toggle } from '../toggle';

describe('toggle', () => {
  it('should create standalone', async () => {
    const win = new TestWindow();
    const el = await win.load({
      components: [Toggle],
      html: '<ion-toggle></ion-toggle>'
    }) as HTMLIonToggleElement;

    const ionChange = spyOnEvent(el, 'ionChange');

    // toggle should not be checked
    testChecked(el, false);

    // set checked
    el.checked = true;
    await win.flush();

    // toggle should be checked
    testChecked(el, true);
    expect(ionChange).toHaveBeenCalledWith({
      checked: true,
      value: 'on'
    });

    // set unchecked
    el.checked = false;
    await win.flush();

    // toggle should not be checked
    testChecked(el, false);
    expect(ionChange).toHaveBeenCalledTimes(2);
    expect(ionChange).toHaveBeenCalledWith({
      checked: false,
      value: 'on'
    });
  });

  it('should create checked standalone', async () => {
    const win = new TestWindow();
    const el = await win.load({
      components: [Toggle],
      html: '<ion-toggle checked></ion-toggle>'
    }) as HTMLIonToggleElement;

    const ionChange = spyOnEvent(el, 'ionChange');

    // toggle should not be checked
    testChecked(el, true);

    // set checked
    el.checked = true;
    await win.flush();

    testChecked(el, true);
    expect(ionChange).not.toHaveBeenCalled();

    // set checked
    el.checked = false;
    await win.flush();

    // toggle should not be checked
    testChecked(el, false);
    expect(ionChange).toHaveBeenCalledTimes(1);
    expect(ionChange).toHaveBeenCalledWith({
      checked: false,
      value: 'on'
    });
  });

  it('should pass properties down to <input>', async () => {
    const win = new TestWindow();
    const el = await win.load({
      components: [Toggle],
      html: '<ion-toggle disabled checked value="coding" name="primary"></ion-toggle>'
    }) as HTMLIonToggleElement;

    expect(el.disabled).toBe(true);
    expect(el.checked).toBe(true);
    expect(el.value).toBe('coding');
    expect(el.name).toBe('primary');

    const input = getInput(el);
    expect(input).toHaveProperties({
      disabled: true,
      checked: true,
      value: 'coding',
      name: 'primary'
    });

    el.disabled = false;
    el.checked = false;
    el.value = 'design';
    el.name = 'secondary';

    await win.flush();
    expect(input.disabled).toBe(false);
    expect(input.checked).toBe(false);
    expect(input.value).toBe('design');
    expect(input.name).toBe('secondary');
  });
});

function testChecked(el: HTMLIonToggleElement, shouldBeChecked: boolean) {
  const input = getInput(el);
  expect(el.checked).toBe(shouldBeChecked);
  expect(input.checked).toBe(shouldBeChecked);
  if (shouldBeChecked) {
    expect(el).toHaveClasses(['toggle-checked']);
  } else {
    expect(el).not.toHaveClasses(['toggle-checked']);
  }
}

function getInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('input')!;
}
