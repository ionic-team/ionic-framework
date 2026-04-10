import { h } from '@stencil/core';

export interface RichContentOption {
  id: string;
  label?: string | HTMLElement;
  startContent?: HTMLElement;
  endContent?: HTMLElement;
  description?: string;
}

const renderClonedContent = (id: string, content: HTMLElement, className: string) => (
  <span
    class={className}
    key={`${className}-${id}`}
    ref={(el) => {
      if (el && !el.hasChildNodes()) {
        Array.from(content.childNodes).forEach((n) => el.appendChild(n.cloneNode(true)));
      }
    }}
  ></span>
);

export const renderOptionLabel = (option: RichContentOption, className: string) => {
  const { id, label, startContent, endContent, description } = option;
  const hasRichContent = !!startContent || !!endContent || !!description;

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
