import { blockedTags, IonicSafeString, reflectPropertiesToAttributes, sanitizeDOMString, sanitizeDOMTree } from '..';

describe('sanitizeDOMString', () => {
  it('disable sanitizer', () => {
    enableSanitizer(false);
    expect(sanitizeDOMString('<img src="x" onerror="alert(document.cookie);">')).toEqual(
      '<img src="x" onerror="alert(document.cookie);">'
    );
  });

  it('bypass sanitizer', () => {
    expect(sanitizeDOMString(new IonicSafeString('<img src="x" onerror="alert(document.cookie);">'))).toEqual(
      '<img src="x" onerror="alert(document.cookie);">'
    );
  });

  it('filter onerror', () => {
    expect(sanitizeDOMString('<img src="x" onerror="alert(document.cookie);">')).toEqual('<img src="x">');
  });

  it('filter onclick', () => {
    expect(
      sanitizeDOMString(
        '<button id="myButton" name="myButton" onclick="alert(document.cookie);">harmless button</button>'
      )
    ).toEqual('<button id="myButton" name="myButton">harmless button</button>');
  });

  it('filter <a> href JS', () => {
    expect(sanitizeDOMString('<a href="javascript:alert(document.cookie)">harmless link</a>')).toEqual(
      '<a>harmless link</a>'
    );
    expect(sanitizeDOMString('<a href="javascr&Tab;ipt:alert(document.cookie)">harmless link</a>')).toEqual(
      '<a>harmless link</a>'
    );
  });

  it('filter <a> href JS + class attribute', () => {
    expect(sanitizeDOMString('<a class="link" href="Javascript&#58;alert(document.cookie)">harmless link</a>')).toEqual(
      '<a class="link">harmless link</a>'
    );
  });

  it('filter <iframe>', () => {
    expect(sanitizeDOMString('<iframe src="javascript:alert(document.cookie)"></iframe>')).toEqual('');
  });

  it('filter href + javascript ', () => {
    expect(
      sanitizeDOMString('<div><button><a href="javascript:alert(document.cookie)">click me</a></button></div>')
    ).toEqual('<div><button><a>click me</a></button></div>');
  });

  it('filter <object>', () => {
    expect(sanitizeDOMString('<object><img src="x" onerror="alert(document.cookie);"></object>')).toEqual('');
  });

  it('sanitizeDOMString', () => {
    expect(
      sanitizeDOMString(
        '<ion-item><ion-label>Hello!</ion-label><ion-button onclick="alert(document.cookie);">Click me</ion-button>'
      )
    ).toEqual('<ion-item><ion-label>Hello!</ion-label><ion-button>Click me</ion-button></ion-item>');
  });

  it('strips rich-content attributes that are scoped to sanitizeDOMTree', () => {
    /**
     * Attributes only allowed by the wider sanitizeDOMTree (rich-content)
     * allowlist must still be stripped here. This keeps the output unchanged
     * for existing consumers (toast, loading, alert message, refresher and
     * infinite-scroll content) that run their innerHTML through
     * sanitizeDOMString.
     */
    expect(
      sanitizeDOMString(
        '<ion-label class="lbl" type="button" value="x" width="40" mode="ios" aria-hidden="true" data-foo="bar">Hi</ion-label>'
      )
    ).toEqual('<ion-label class="lbl">Hi</ion-label>');
  });
});

describe('sanitizeDOMTree', () => {
  beforeEach(() => {
    enableSanitizer(true);
  });

  it('should strip a blocked <script> element from the subtree', () => {
    const root = document.createElement('div');
    root.innerHTML = '<p>safe</p><script>alert(1)</script>';

    sanitizeDOMTree(root);

    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('p')).not.toBeNull();
  });

  it('should strip every blocked tag type', () => {
    const root = document.createElement('div');
    root.innerHTML = blockedTags.map((tag) => `<${tag}></${tag}>`).join('') + '<span>keep</span>';

    sanitizeDOMTree(root);

    for (const blocked of blockedTags) {
      expect(root.querySelector(blocked)).toBeNull();
    }
    expect(root.querySelector('span')).not.toBeNull();
  });

  it('should strip blocked elements nested deep in the tree', () => {
    const root = document.createElement('div');
    root.innerHTML = '<section><article><script>alert(1)</script><span>keep</span></article></section>';

    sanitizeDOMTree(root);

    expect(root.querySelector('script')).toBeNull();
    expect(root.querySelector('span')?.textContent).toBe('keep');
  });

  it('should remove on* event-handler attributes', () => {
    const root = document.createElement('div');
    root.innerHTML = '<button onclick="alert(1)" onmouseover="alert(2)">click</button>';

    sanitizeDOMTree(root);

    const button = root.querySelector('button')!;
    expect(button.hasAttribute('onclick')).toBe(false);
    expect(button.hasAttribute('onmouseover')).toBe(false);
  });

  it('should strip javascript: URLs while keeping the element', () => {
    const root = document.createElement('div');
    root.innerHTML = '<a href="javascript:alert(1)">link</a>';

    sanitizeDOMTree(root);

    const anchor = root.querySelector('a')!;
    expect(anchor).not.toBeNull();
    expect(anchor.hasAttribute('href')).toBe(false);
  });

  it('should preserve component attributes like size, color, and shape', () => {
    const root = document.createElement('div');
    root.innerHTML = '<ion-button size="small" color="primary" shape="round">button</ion-button>';

    sanitizeDOMTree(root);

    const button = root.querySelector('ion-button')!;
    expect(button.getAttribute('size')).toBe('small');
    expect(button.getAttribute('color')).toBe('primary');
    expect(button.getAttribute('shape')).toBe('round');
  });

  it('should strip the style attribute', () => {
    const root = document.createElement('div');
    root.innerHTML = '<span style="background:url(//evil)">text</span>';

    sanitizeDOMTree(root);

    expect(root.querySelector('span')!.hasAttribute('style')).toBe(false);
  });

  it('should strip form/navigation-hijack attributes', () => {
    const root = document.createElement('div');
    root.innerHTML = '<button formaction="//evil" action="//evil" target="_blank">go</button>';

    sanitizeDOMTree(root);

    const button = root.querySelector('button')!;
    expect(button.hasAttribute('formaction')).toBe(false);
    expect(button.hasAttribute('action')).toBe(false);
    expect(button.hasAttribute('target')).toBe(false);
  });

  it('should preserve inline SVG presentation attributes', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">' +
      '<circle cx="12" cy="12" r="10" fill="red" stroke="blue" stroke-width="2"></circle></svg>';

    sanitizeDOMTree(root);

    const svg = root.querySelector('svg')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('width')).toBe('24');
    const circle = root.querySelector('circle')!;
    expect(circle.getAttribute('cx')).toBe('12');
    expect(circle.getAttribute('r')).toBe('10');
    expect(circle.getAttribute('fill')).toBe('red');
    expect(circle.getAttribute('stroke-width')).toBe('2');
  });

  it('should preserve aria-* and data-* attributes', () => {
    const root = document.createElement('div');
    root.innerHTML = '<ion-icon aria-hidden="true" data-value="star"></ion-icon>';

    sanitizeDOMTree(root);

    const icon = root.querySelector('ion-icon')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('data-value')).toBe('star');
  });

  it('should strip namespaced attributes such as xlink:href', () => {
    const root = document.createElement('div');
    root.innerHTML = '<svg><a xlink:href="javascript:alert(1)"><text>x</text></a></svg>';

    sanitizeDOMTree(root);

    const anchor = root.querySelector('a')!;
    expect(anchor.hasAttribute('xlink:href')).toBe(false);
  });

  it('should strip entity-obfuscated javascript: schemes', () => {
    const root = document.createElement('div');
    // The parser decodes &#9; to a tab, hiding the scheme from a naive
    // substring check; normalization must still catch it.
    root.innerHTML = '<a href="java&#9;script:alert(1)">link</a>';

    sanitizeDOMTree(root);

    expect(root.querySelector('a')!.hasAttribute('href')).toBe(false);
  });

  it('should strip vbscript: schemes', () => {
    const root = document.createElement('div');
    root.innerHTML = '<a href="vbscript:msgbox(1)">link</a>';

    sanitizeDOMTree(root);

    expect(root.querySelector('a')!.hasAttribute('href')).toBe(false);
  });

  it('should keep safe image data: URIs', () => {
    const root = document.createElement('div');
    const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNgAAAAAgAB';
    root.innerHTML = `<img src="${png}" />`;

    sanitizeDOMTree(root);

    expect(root.querySelector('img')!.getAttribute('src')).toBe(png);
  });

  it('should strip document-bearing data: URIs', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<a href="data:text/html,<script>alert(1)</script>">html</a>' +
      '<img src="data:image/svg+xml,<svg onload=alert(1)>" />';

    sanitizeDOMTree(root);

    expect(root.querySelector('a')!.hasAttribute('href')).toBe(false);
    expect(root.querySelector('img')!.hasAttribute('src')).toBe(false);
  });

  it('should be a no-op when the sanitizer is disabled', () => {
    enableSanitizer(false);
    const root = document.createElement('div');
    root.innerHTML = '<script>alert(1)</script><button onclick="alert(1)">click</button>';

    sanitizeDOMTree(root);

    expect(root.querySelector('script')).not.toBeNull();
    expect(root.querySelector('button')!.hasAttribute('onclick')).toBe(true);
  });
});

describe('reflectPropertiesToAttributes', () => {
  it('should reflect a known DOM property onto its attribute', () => {
    const icon = document.createElement('ion-icon');
    (icon as any).name = 'star';

    reflectPropertiesToAttributes(icon);

    expect(icon.getAttribute('name')).toBe('star');
  });

  it('should reflect properties on a nested element', () => {
    const root = document.createElement('div');
    const icon = document.createElement('ion-icon');
    (icon as any).icon = 'logo-ionic';
    root.appendChild(icon);

    reflectPropertiesToAttributes(root);

    expect(icon.getAttribute('icon')).toBe('logo-ionic');
  });

  it('should not overwrite an attribute that is already present', () => {
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'existing');
    (icon as any).name = 'from-property';

    reflectPropertiesToAttributes(icon);

    expect(icon.getAttribute('name')).toBe('existing');
  });

  it('should ignore empty-string and non-string property values', () => {
    const icon = document.createElement('ion-icon');
    (icon as any).name = '';
    (icon as any).icon = 42;

    reflectPropertiesToAttributes(icon);

    expect(icon.hasAttribute('name')).toBe(false);
    expect(icon.hasAttribute('icon')).toBe(false);
  });

  it('should leave elements without reflected properties untouched', () => {
    const div = document.createElement('div');
    (div as any).name = 'value';

    reflectPropertiesToAttributes(div);

    expect(div.hasAttribute('name')).toBe(false);
  });
});

const enableSanitizer = (enable = true) => {
  (window as any).Ionic = {};
  (window as any).Ionic.config = {};
  (window as any).Ionic.config.sanitizerEnabled = enable;
};
