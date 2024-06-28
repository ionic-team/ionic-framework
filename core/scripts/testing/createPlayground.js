export async function createPlayground(componentTag, propDefinitions, innerContent = '') {
  const playground = document.createElement('div');
  const form = document.createElement('form');
  const preview = document.createElement('div');
  preview.classList.add('preview');

  function renderComponent(props) {
    const component = document.createElement(componentTag);
    Object.keys(props).forEach(propName => {
      if (props[propName] !== undefined && props[propName] !== '') {
        component.setAttribute(propName, props[propName]);
      }
    });

    // Set inner HTML content if provided
    if (innerContent) {
      component.innerHTML = innerContent;
    }

    preview.innerHTML = '';
    preview.appendChild(component);
  }

  propDefinitions.forEach(prop => {
    const label = document.createElement('label');
    const labelText = document.createElement('span');
    labelText.textContent = `${prop.name}: `;

    const input = document.createElement('input');
    input.type = prop.type === 'boolean' ? 'checkbox' : 'text';
    input.name = prop.name;
    input.value = prop.defaultValue || '';

    if (prop.type === 'boolean') {
      input.checked = prop.defaultValue === 'true';
    }

    input.addEventListener('input', () => {
      const formData = new FormData(form);
      const props = {};

      formData.forEach((value, key) => {
        const field = form.elements[key];

        if (field.type === 'checkbox') {
          props[key] = field.checked;
        } else {
          props[key] = value;
        }
      });

      renderComponent(props);
    });

    label.appendChild(labelText);
    label.appendChild(input);
    form.appendChild(label);
    form.appendChild(document.createElement('br'));
  });

  playground.appendChild(preview);
  // add a divider
  playground.appendChild(document.createElement('hr'));
  playground.appendChild(form);

  // Initial render with default props
  const defaultProps = Object.fromEntries(
    propDefinitions.map(prop => [prop.name, prop.defaultValue || ''])
  );

  renderComponent(defaultProps);

  return playground;
}
