import { h } from '@stencil/core';

interface RichContentOption {
  /** Unique identifier for stable virtual DOM keys across re-renders. */
  id: string;
  /** The main label for the option as a string or an HTMLElement. */
  label?: string | HTMLElement;
  /** Content to display at the start of the option. */
  startContent?: HTMLElement;
  /** Content to display at the end of the option. */
  endContent?: HTMLElement;
  /** A description for the option. */
  description?: string;
}

/**
 * Cache that maps rendered span elements to the source HTMLElement
 * they were cloned from. This prevents flickering when a user
 * selects an option that has rich content, as the content will only be
 * re-rendered if the source HTMLElement changes.
 */
const contentCache = new WeakMap<HTMLElement, HTMLElement>();

/**
 * Renders cloned DOM content into a span element via a ref callback.
 * The content is only cloned when the source element changes,
 * preventing flicker caused by destroying and recreating web
 * components (e.g., ion-avatar) on every re-render cycle.
 *
 * Span elements should be used when this content renders within buttons,
 * depending on the select interface. Buttons can only have phrasing
 * content to prevent accessibility issues.
 *
 * @param id - Unique identifier for generating stable virtual DOM keys.
 * @param content - The HTMLElement container whose child nodes will be cloned.
 * @param className - CSS class applied to the wrapper span.
 * @param useSpan - Whether to use a span element instead of a div for the wrapper.
 */
const renderClonedContent = (id: string, content: HTMLElement, className: string, useSpan = false) => {
  const Tag = useSpan ? 'span' : 'div';
  return (
    <Tag
      class={className}
      key={`${className}-${id}`}
      ref={(el) => {
        if (el) {
          const cached = contentCache.get(el);
          // Skip if this element already has clones from the same source
          if (cached === content) {
            return;
          }

          // Clear previous content and clone new nodes
          el.innerHTML = '';
          Array.from(content.childNodes).forEach((n) => el.appendChild(n.cloneNode(true)));
          contentCache.set(el, content);
        }
      }}
    ></Tag>
  );
};

/**
 * Renders the label content for a select option within an overlay
 * interface based on the presence of rich content.
 *
 * Span elements should be used when this content renders within buttons,
 * depending on the select interface. Buttons can only have phrasing
 * content to prevent accessibility issues.
 *
 * @param option - The content option data containing label, slots,
 * and description.
 * @param className - The base CSS class for the label element.
 * @param useSpan - Whether to use a span element instead of a div for the label.
 */
export const renderOptionLabel = (
  option: RichContentOption,
  className: string,
  useSpan = false
): HTMLElement | string | undefined => {
  const { id, label, startContent, endContent, description } = option;
  const hasRichContent = !!startContent || !!endContent || !!description;
  const Tag = useSpan ? 'span' : 'div';

  // Render simple string label if there is no rich content to display
  if (!hasRichContent && (typeof label === 'string' || !label)) {
    // const Tag = useSpan ? 'span' : 'div';

    return (
      <Tag class={className} key={`${className}-${id}`}>
        {label}
      </Tag>
    );
  }

  // Render the main label
  const labelEl =
    typeof label === 'string' || !label ? (
      // Label is a simple string or undefined
      <Tag key={`${className}-label-${id}`}>{label}</Tag>
    ) : (
      // Label is an HTMLElement with potential rich content
      renderClonedContent(id, label, `${className}-text`, useSpan)
    );

  // No rich content, render just the label
  if (!hasRichContent) {
    return (
      <Tag class={className} key={`${className}-${id}`}>
        {labelEl}
      </Tag>
    );
  }

  // Render label with rich content (start, end, description)
  return (
    <Tag class={className} key={`${className}-${id}`}>
      {startContent && renderClonedContent(id, startContent, 'select-option-start', useSpan)}
      <Tag class="select-option-content" key={`${className}-content-${id}`}>
        {labelEl}
        {description && (
          <Tag class="select-option-description" key={`${className}-desc-${id}`}>
            {description}
          </Tag>
        )}
      </Tag>
      {endContent && renderClonedContent(id, endContent, 'select-option-end', useSpan)}
    </Tag>
  );
};
