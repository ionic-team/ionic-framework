import type { VNode } from '@stencil/core';

import { cloneToVNode } from '../select-option-render';

/**
 * `cloneToVNode` returns Stencil's internal VNode object, whose fields are
 * name-mangled (`$tag$`, `$attrs$`, etc.). Casting to this shape keeps the
 * assertions readable without depending on the public `VNode` type, which
 * does not expose those runtime fields.
 */
interface RuntimeVNode {
  $tag$: string | null;
  $text$: string | null;
  $attrs$: Record<string, string> | null;
  $children$: RuntimeVNode[] | null;
  $key$: string | null;
}

const asVNode = (value: VNode | string | null): RuntimeVNode => value as unknown as RuntimeVNode;

describe('cloneToVNode', () => {
  describe('text nodes', () => {
    it('should return the text content of a text node as a string', () => {
      const node = document.createTextNode('hello world');

      expect(cloneToVNode(node, 'prefix', 0)).toBe('hello world');
    });

    it('should return an empty string when text content is empty', () => {
      const node = document.createTextNode('');

      expect(cloneToVNode(node, 'prefix', 0)).toBe('');
    });
  });

  describe('unsupported nodes', () => {
    it('should return null for a comment node', () => {
      const node = document.createComment('a comment');

      expect(cloneToVNode(node, 'prefix', 0)).toBeNull();
    });
  });

  describe('element nodes', () => {
    it('should convert an element to a VNode with the lowercased tag name', () => {
      const el = document.createElement('SPAN');

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      expect(vnode.$tag$).toBe('span');
    });

    it('should build a stable key from the prefix and index', () => {
      const el = document.createElement('div');

      const vnode = asVNode(cloneToVNode(el, 'prefix', 3));

      expect(vnode.$key$).toBe('prefix-3');
      expect(vnode.$attrs$?.key).toBe('prefix-3');
    });

    it('should copy all attributes from the source element', () => {
      const el = document.createElement('span');
      el.setAttribute('class', 'foo bar');
      el.setAttribute('data-value', '42');
      el.setAttribute('aria-label', 'label');

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      expect(vnode.$attrs$).toEqual({
        key: 'prefix-0',
        class: 'foo bar',
        'data-value': '42',
        'aria-label': 'label',
      });
    });

    it('should recursively convert child element nodes', () => {
      const el = document.createElement('div');
      el.appendChild(document.createElement('span'));
      el.appendChild(document.createElement('img'));

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      expect(vnode.$children$).toHaveLength(2);
      expect(vnode.$children$?.[0].$tag$).toBe('span');
      expect(vnode.$children$?.[1].$tag$).toBe('img');
    });

    it('should derive child keys from the parent key', () => {
      const el = document.createElement('div');
      el.appendChild(document.createElement('span'));

      const vnode = asVNode(cloneToVNode(el, 'prefix', 2));

      // Parent key is `prefix-2`, so the first child key is `prefix-2-0`
      expect(vnode.$children$?.[0].$key$).toBe('prefix-2-0');
    });

    it('should preserve text child content', () => {
      const el = document.createElement('span');
      el.appendChild(document.createTextNode('inner text'));

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      // `cloneToVNode` returns the text as a string, which `h` wraps into a
      // text VNode (`$tag$` null, content on `$text$`).
      expect(vnode.$children$).toHaveLength(1);
      expect(vnode.$children$?.[0].$tag$).toBeNull();
      expect(vnode.$children$?.[0].$text$).toBe('inner text');
    });

    it('should filter out unsupported child nodes', () => {
      const el = document.createElement('div');
      el.appendChild(document.createElement('span'));
      el.appendChild(document.createComment('skip me'));
      el.appendChild(document.createTextNode('keep me'));

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      // The comment node is dropped, leaving the span and the text
      expect(vnode.$children$).toHaveLength(2);
      expect(vnode.$children$?.[0].$tag$).toBe('span');
      expect(vnode.$children$?.[1].$text$).toBe('keep me');
    });

    it('should convert a deeply nested structure', () => {
      const el = document.createElement('div');
      const child = document.createElement('span');
      const grandchild = document.createElement('strong');
      grandchild.appendChild(document.createTextNode('deep'));
      child.appendChild(grandchild);
      el.appendChild(child);

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      const span = vnode.$children$?.[0];
      const strong = span?.$children$?.[0];
      expect(span?.$tag$).toBe('span');
      expect(strong?.$tag$).toBe('strong');
      expect(strong?.$children$?.[0].$text$).toBe('deep');
    });

    it('should produce no children for an empty element', () => {
      const el = document.createElement('div');

      const vnode = asVNode(cloneToVNode(el, 'prefix', 0));

      // `h` normalizes an empty children array to `null`
      expect(vnode.$children$).toBeNull();
    });
  });
});
