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
 * Uses span elements because this content may render within buttons,
 * depending on the select interface. Buttons can only have phrasing
 * content to prevent accessibility issues.
 *
 * @param id - Unique identifier for generating stable virtual DOM keys.
 * @param content - The HTMLElement container whose child nodes will be cloned.
 * @param className - CSS class applied to the wrapper span.
 */
const renderClonedContent = (id: string, content: HTMLElement, className: string) => {
  return (
    <span
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
    ></span>
  );
};

/**
 * Renders the label content for a select option within an overlay
 * interface based on the presence of rich content.
 *
 * Uses span elements because this content may render within buttons,
 * depending on the select interface. Buttons can only have phrasing
 * content to prevent accessibility issues.
 *
 * @param option - The content option data containing label, slots,
 * and description.
 * @param className - The base CSS class for the label element.
 */
export const renderOptionLabel = (option: RichContentOption, className: string): HTMLElement => {
  const { id, label, startContent, endContent, description } = option;
  const hasRichContent = !!startContent || !!endContent || !!description;

  // Render the main label
  const labelEl =
    typeof label === 'string' || !label ? (
      <span key={`${className}-label-${id}`}>{label}</span>
    ) : (
      renderClonedContent(id, label, `${className}-text`)
    );

  if (!hasRichContent) {
    return (
      <span class={className} key={`${className}-${id}`}>
        {labelEl}
      </span>
    );
  }

  return (
    <span class={className} key={`${className}-${id}`}>
      {startContent && renderClonedContent(id, startContent, 'select-option-start')}
      <span class="select-option-content" key={`${className}-content-${id}`}>
        {labelEl}
        {description && (
          <span class="select-option-description" key={`${className}-desc-${id}`}>
            {description}
          </span>
        )}
      </span>
      {endContent && renderClonedContent(id, endContent, 'select-option-end')}
    </span>
  );
};
