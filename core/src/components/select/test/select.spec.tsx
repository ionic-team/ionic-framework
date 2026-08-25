import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { alertController } from '@utils/overlays';

import type { AlertInput } from '../../alert/alert-interface';

import { config } from '../../../global/config';
import { SelectOption } from '../../select-option/select-option';
import { Select } from '../select';

describe('ion-select', () => {
  it('should render hidden input for form validation', async () => {
    const page = await newSpecPage({
      components: [Select],
      template: () => <ion-select value="my value" name="my name" disabled={true}></ion-select>,
    });

    const select = page.body.querySelector('ion-select')!;

    const hiddenInput = select.querySelector<HTMLInputElement>('input[type="hidden"]')!;
    expect(hiddenInput).not.toBe(null);

    expect(hiddenInput.value).toBe('my value');
    expect(hiddenInput.disabled).toBe(true);
    expect(hiddenInput.name).toBe('my name');
  });

  it('should render label prop if only prop provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const propEl = select.shadowRoot!.querySelector('.label-text');
    const slotEl = select.shadowRoot!.querySelector('slot[name="label"]');

    expect(propEl).not.toBe(null);
    expect(slotEl).toBe(null);
  });
  it('should render label slot if only slot provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select><div slot="label">Label Prop Slot</div></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const propEl = select.shadowRoot!.querySelector('.label-text');
    const slotEl = select.shadowRoot!.querySelector('slot[name="label"]');

    expect(propEl).toBe(null);
    expect(slotEl).not.toBe(null);
  });
  it('should render label prop if both prop and slot provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"><div slot="label">Label Prop Slot</div></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const propEl = select.shadowRoot!.querySelector('.label-text');
    const slotEl = select.shadowRoot!.querySelector('slot[name="label"]');

    expect(propEl).not.toBe(null);
    expect(slotEl).toBe(null);
  });
  it('should prefer aria label if both attribute and visible text provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select aria-label="Aria Label Text" label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-label')).toBe('Aria Label Text');
  });
  it('should prefer visible label if only visible text provided', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select label="Label Prop Text"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-label')).toBe('Label Prop Text');
  });
});

describe('select: slot interactivity', () => {
  test('should not prevent click handlers from firing', async () => {
    // https://github.com/ionic-team/ionic-framework/issues/28818
    const divSpy = vi.fn();
    const buttonSpy = vi.fn();

    const page = await newSpecPage({
      components: [Select],
      template: () => (
        <div onClick={divSpy}>
          <ion-select label="Label Prop Text">
            <button slot="end" onClick={buttonSpy}>
              Button
            </button>
          </ion-select>
        </div>
      ),
    });

    const button = page.body.querySelector('button')!;

    await button.click();

    expect(buttonSpy).toHaveBeenCalled();
    expect(divSpy).toHaveBeenCalled();
  });
});

describe('ion-select: required', () => {
  it('should have a aria-required attribute as true in inner button', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select required="true"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-required')).toBe('true');
  });

  it('should not have a aria-required attribute as false in inner button', async () => {
    const page = await newSpecPage({
      components: [Select],
      html: `
        <ion-select required="false"></ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    const nativeButton = select.shadowRoot!.querySelector('button')!;

    expect(nativeButton.getAttribute('aria-required')).toBe('false');
  });
});

describe('ion-select: option plain text', () => {
  it('should not insert a space between adjacent text nodes in an option', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;

    appendAdjacentTextNodes(select.querySelector('ion-select-option')!);

    select.value = 'star';
    await page.waitForChanges();

    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('★Star');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('★Star');
  });

  it('should read option text that is wrapped in an element', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select value="star"><ion-select-option value="star">A <b>Star</b></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    await page.waitForChanges();

    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('A Star');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('A Star');
  });

  it('should read option text when the whole option content is wrapped in an element', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select value="star"><ion-select-option value="star"><b>Star</b></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    await page.waitForChanges();

    /**
     * An option with no text node of its own, such as one whose label comes
     * from an i18n component, would otherwise render as an empty select with
     * an empty accessible name.
     */
    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('Star');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('Star');
  });

  it('should ignore content assigned to the start and end slots', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select value="star"><ion-select-option value="star"><b slot="start">Lead</b>Star<b slot="end">Trail</b></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    await page.waitForChanges();

    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('Star');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('Star');
  });

  it('should not read text the browser never paints', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select value="star"><ion-select-option value="star"><style>.a{color:red}</style>Star</ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    await page.waitForChanges();

    /**
     * `textContent` includes the source of tags the browser does not render,
     * and those tags are the same ones the sanitizer strips from the
     * custom HTML path, so both paths have to agree to ignore them.
     */
    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('Star');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('Star');
  });

  it('should collapse whitespace from the source markup around option text', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `
        <ion-select value="star">
          <ion-select-option value="star">
            Star   Option
          </ion-select-option>
        </ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;
    await page.waitForChanges();

    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('Star Option');
  });

  it('should preserve a non-breaking space that indents option text', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select value="star"><ion-select-option value="star">&nbsp;&nbsp;Star Option</ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    await page.waitForChanges();

    /**
     * NBSP is not collapsible, so an option indented with `&nbsp;` to fake a
     * hierarchy keeps its indentation. Trimming has to leave it alone too,
     * which rules out `String.prototype.trim`.
     */
    expect(select.shadowRoot!.querySelector('.select-text')!.textContent).toBe('\u00a0\u00a0Star Option');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('\u00a0\u00a0Star Option');
  });
});

/**
 * Frameworks render `{icon}{label}` as two sibling text nodes with no
 * whitespace between them. The nodes have to be built here rather than in
 * markup, because a parser collapses adjacent text into a single node.
 */
const appendAdjacentTextNodes = (option: Element) => {
  option.append(document.createTextNode('★'), document.createTextNode('Star'));
};

/**
 * The overlay interfaces build their labels from the same helper that produces
 * the displayed text, so they need the same coverage. `ion-alert` is not
 * defined in a spec page, so the created overlay is stubbed and the options
 * passed to the controller are asserted instead.
 */
const stubAlertController = () =>
  vi.spyOn(alertController, 'create').mockImplementation(async () => {
    const overlay = document.createElement('div') as any;
    overlay.present = () => Promise.resolve();
    // Never resolves, so the select keeps treating the overlay as open.
    overlay.onDidDismiss = () => new Promise(() => {});
    return overlay;
  });

describe('ion-select: overlay option labels', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should label alert inputs with the text the option renders', async () => {
    const createAlert = stubAlertController();

    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `
        <ion-select>
          <ion-select-option value="adjacent"></ion-select-option>
          <ion-select-option value="wrapped"><b>Star</b></ion-select-option>
        </ion-select>
      `,
    });

    const select = page.body.querySelector('ion-select')!;

    appendAdjacentTextNodes(select.querySelector('ion-select-option[value="adjacent"]')!);

    await page.waitForChanges();

    await select.open();

    expect(createAlert).toHaveBeenCalledTimes(1);
    const { inputs } = createAlert.mock.calls[0][0];
    expect(inputs!.map((input: AlertInput) => input.label)).toEqual(['★Star', 'Star']);
  });
});

describe('ion-select: option plain text with custom HTML enabled', () => {
  /**
   * With `innerHTMLTemplatesEnabled` on, the option is read through
   * `getOptionContent` instead. An option that holds only text still has to
   * produce the same text as the default path.
   */
  beforeEach(() => {
    config.reset({ innerHTMLTemplatesEnabled: true });
  });

  afterEach(() => {
    config.reset({});
    vi.restoreAllMocks();
  });

  it('should not insert a space between adjacent text nodes in an option', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    appendAdjacentTextNodes(select.querySelector('ion-select-option')!);

    select.value = 'star';
    await page.waitForChanges();

    expect(select.shadowRoot!.querySelector('.select-text')!.innerHTML).toBe('★Star');
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('★Star');
  });

  it('should not insert a space between adjacent text nodes in an option that also holds an element', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    const option = select.querySelector('ion-select-option')!;
    appendAdjacentTextNodes(option);

    const badge = document.createElement('ion-badge');
    badge.textContent = 'NEW';
    option.append(badge);

    select.value = 'star';
    await page.waitForChanges();

    /**
     * An element in the default slot reads the option through a different
     * branch than an option that holds only text. The text nodes render as
     * one span, so the `aria-label` has to keep them together too. The
     * visible separation from the badge comes from `--select-text-gap`
     * rather than from a space in the text.
     */
    expect(select.shadowRoot!.querySelector('.select-text')!.innerHTML).toBe(
      '<span>★Star</span><ion-badge>NEW</ion-badge>'
    );
    expect(select.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe('★StarNEW');
  });

  it('should label alert inputs with the text the option renders', async () => {
    const createAlert = stubAlertController();

    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"></ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    appendAdjacentTextNodes(select.querySelector('ion-select-option')!);
    await page.waitForChanges();

    await select.open();

    const { inputs } = createAlert.mock.calls[0][0];
    expect(inputs!.map((input) => input.label)).toEqual(['★Star']);
  });
});

describe('ion-select: option content property reflection', () => {
  beforeEach(() => {
    // Cloning rich option content into the select text only happens when
    // custom HTML rendering is enabled.
    config.reset({ innerHTMLTemplatesEnabled: true });
  });

  afterEach(() => {
    config.reset({});
  });

  it('should reflect ion-icon DOM properties onto attributes so they survive cloning into the select text', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"><ion-icon></ion-icon>Star</ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;
    const sourceIcon = select.querySelector('ion-icon')!;

    /**
     * Frameworks such as Vue set `icon` as a DOM property rather than an
     * attribute. `cloneNode` only copies attributes, so without reflection
     * the cloned copy in the select text would lose the icon value.
     */
    (sourceIcon as any).icon = 'logo-ionic';

    // Selecting the option rebuilds the displayed text from the option content.
    select.value = 'star';
    await page.waitForChanges();

    const renderedIcon = select.shadowRoot!.querySelector('.select-text ion-icon');
    expect(renderedIcon).not.toBeNull();
    expect(renderedIcon!.getAttribute('icon')).toBe('logo-ionic');
  });

  it('should preserve an ion-icon attribute that is already set when cloning into the select text', async () => {
    const page = await newSpecPage({
      components: [Select, SelectOption],
      html: `<ion-select><ion-select-option value="star"><ion-icon icon="logo-ionic"></ion-icon>Star</ion-select-option></ion-select>`,
    });

    const select = page.body.querySelector('ion-select')!;

    select.value = 'star';
    await page.waitForChanges();

    const renderedIcon = select.shadowRoot!.querySelector('.select-text ion-icon');
    expect(renderedIcon).not.toBeNull();
    expect(renderedIcon!.getAttribute('icon')).toBe('logo-ionic');
  });
});
