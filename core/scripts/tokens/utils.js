let variablesPrefix; // Variable that holds the prefix used on all css and scss variables generated

// Set the variable prefix value
function setPrefixValue(prefix) {
  variablesPrefix = prefix;
  return variablesPrefix;
}

// Generates a valid rgba() color
function getRgbaValue(propValue) {
  // Check if its rgba color
  const isRgba = hexToRgba(propValue);
  // If it is, then compose rgba() color, otherwise use the normal color
  if (isRgba !== null) {
    return (propValue = `rgba(${isRgba.r}, ${isRgba.g}, ${isRgba.b},${isRgba.a})`);
  } else {
    return propValue;
  }
}

// Translates an hex color value to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Translates an hex color value to rgba
function hexToRgba(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: Math.round((parseInt(result[4], 16) * 100) / 255) / 100,
      }
    : null;
}

// Utility function to remove consecutive repeated words
function removeConsecutiveRepeatedWords(str) {
    return str.replace(/(\b\w+\b)(-\1)+/g, '$1');
}

// Generates a valid box-shadow value from a shadow Design Token structure
function generateShadowValue(prop, propName) {
  const cssShadow = prop.$value.map(shadow => {
    // Assuming shadow is an object with properties like offsetX, offsetY, blurRadius, spreadRadius, color
    const color = getRgbaValue(shadow.color);
    return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`;
}).join(', ');

  return `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${cssShadow});`;
}

// Generates a valid font-size value from a font-size Design Token structure, while transforming the pixels to rem
function generateFontSizeValue(prop, propName, variableType = 'css') {
  return variableType === 'scss'
    ? `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, font.px-to-rem(${parseInt(
        prop.$value
      )}));`
    : `--${propName}: #{font.px-to-rem(${parseInt(prop.$value)})};`;
}

// Generates a valid font-family value from a font-family Design Token structure
function generateFontFamilyValue(prop, propName, variableType = 'css') {
  // Remove the last word from the token, as it contains the name of the font, which we don't want to be included on the generated variables
  const _propName = propName.split('-').slice(0, -1).join('-');

  return variableType === 'scss'
    ? `$${variablesPrefix}-${_propName}: var(--${variablesPrefix}-${_propName}, "${prop.$value}", sans-serif);`
    : `--${variablesPrefix}-${_propName}: "${prop.$value}", sans-serif;`;
}

// Generates a final value, based if the Design Token is of type color or not
function generateValue(prop, propName) {
  const rgb = hexToRgb(prop.$value);

  let rgbDeclaration = '';

  if (rgb) {
    // If the token is color, also add a rgb variable using the same color
    rgbDeclaration = `\n$${variablesPrefix}-${propName}-rgb: var(--${variablesPrefix}-${propName}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`;
    prop.value = getRgbaValue(prop.$value);
  }

  return `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${prop.$value});${rgbDeclaration}`;
}

// Generates a typography based css utility-class or scss variable from a typography token structure
function generateTypographyOutput(prop, propName, isVariable) {
  const typography = prop.original.$value;

  // Extract the part after the last dot and trim any extraneous characters
  const extractLastPart = (str) => str.split('.').pop().replace(/[^\w-]/g, '');

  const _initialWrapper = isVariable ? ': (' : ` {`;
  const _endWrapper = isVariable ? ')' : `}`;
  const _prefix = isVariable ? '$' : `.`;
  const _endChar = isVariable ? ',' : ';';

  // This exact format is needed so that it compiles the tokens with the expected lint rules
  return `
  ${_prefix}${variablesPrefix}-${propName}${_initialWrapper}
    font-size: $${variablesPrefix}-font-size-${extractLastPart(typography.fontSize)}${_endChar}
    font-style: ${prop.attributes.item?.toLowerCase() === 'italic' ? 'italic' : 'normal'}${_endChar}
    font-weight: $${variablesPrefix}-font-weight-${extractLastPart(typography.fontWeight)}${_endChar}
    letter-spacing: $${variablesPrefix}-letter-spacing-${extractLastPart(typography.letterSpacing) || 0}${_endChar}
    line-height: $${variablesPrefix}-line-height-${extractLastPart(typography.lineHeight)}${_endChar}
    text-transform: ${typography.textCase}${_endChar}
    text-decoration: ${typography.textDecoration}${_endChar}
  ${_endWrapper};
  `;
}

// Generates a color based css utility-class from a color Design Token structure
function generateColorUtilityClasses(prop, className) {
  return `.${variablesPrefix}-${className} {\n  color: $${variablesPrefix}-${prop.name};\n}
  .${variablesPrefix}-background-${className} {\n  background-color: $${variablesPrefix}-${prop.name};\n}`;
}

// Generates a margin or padding based css utility-class from a space Design Token structure
function generateSpaceUtilityClasses(prop, className) {
  // This exact format is needed so that it compiles the tokens with the expected lint rules
  // It will generate classes for margin and padding, for equal sizing on all side and each direction
  const marginPaddingTemplate = (type) => `
.${variablesPrefix}-${type}-${className} {
  --${type}-top: #{$${variablesPrefix}-${prop.name}};
  --${type}-end: #{$${variablesPrefix}-${prop.name}};
  --${type}-bottom: #{$${variablesPrefix}-${prop.name}};
  --${type}-start: #{$${variablesPrefix}-${prop.name}};

  @include ${type}($${variablesPrefix}-${prop.name});
};

.${variablesPrefix}-${type}-top-${className} {
  --${type}-top: #{$${variablesPrefix}-${prop.name}};

  @include ${type}($${variablesPrefix}-${prop.name}, null, null, null);
};

.${variablesPrefix}-${type}-end-${className} {
  --${type}-end: #{$${variablesPrefix}-${prop.name}};

  @include ${type}(null, $${variablesPrefix}-${prop.name}, null, null);
};

.${variablesPrefix}-${type}-bottom-${className} {
  --${type}-bottom: #{$${variablesPrefix}-${prop.name}};

  @include ${type}(null, null, $${variablesPrefix}-${prop.name}, null);
};

.${variablesPrefix}-${type}-start-${className} {
  --${type}-start: #{$${variablesPrefix}-${prop.name}};

  @include ${type}(null, null, null, $${variablesPrefix}-${prop.name});
};
`;

  return `${marginPaddingTemplate('margin')}\n${marginPaddingTemplate('padding')}`;
}

// Generates a valid box-shadow value from a shadow Design Token structure
function generateRadiusUtilityClasses(propName) {
  return `.${variablesPrefix}-${propName} {\n  border-radius: $${variablesPrefix}-${propName};\n}`;
}

// Generates a font based css utility-class from a font Design Token structure
function generateBorderSizeUtilityClasses(propName) {
  return `.${variablesPrefix}-${propName} {\n  border-width: $${variablesPrefix}-${propName};\n}`;
}

// Generates a font based css utility-class from a font Design Token structure
function generateFontUtilityClasses(prop, propName) {
  return `.${variablesPrefix}-${propName} {\n  ${prop.attributes.type}: $${variablesPrefix}-${propName};\n}`;
}

// Generates a valid box-shadow value from a shadow Design Token structure
function generateShadowUtilityClasses(propName) {
  return `.${variablesPrefix}-${propName} {\n  box-shadow: $${variablesPrefix}-${propName};\n}`;
}

// Generates a utility class for a given token category and name
function generateUtilityClasses(tokenCategory, propName){
  return `.${variablesPrefix}-${propName} {\n  ${tokenCategory}: $${variablesPrefix}-${propName};\n}`;
}

module.exports = {
    getRgbaValue,
    hexToRgb,
    generateShadowValue,
    generateFontSizeValue,
    generateFontFamilyValue,
    generateTypographyOutput,
    generateValue,
    setPrefixValue,
    generateRadiusUtilityClasses,
    generateColorUtilityClasses,
    generateSpaceUtilityClasses,
    removeConsecutiveRepeatedWords,
    generateBorderSizeUtilityClasses,
    generateFontUtilityClasses,
    generateShadowUtilityClasses,
    generateUtilityClasses
};