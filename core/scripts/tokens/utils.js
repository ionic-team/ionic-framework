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

// Generates a reference variable for an alias token type
// (e.g., $ion-border-default: var(--ion-border-default, #d5d5d5) → $ion-border-default: var(--ion-border-default, $ion-primitives-neutral-400))
function getAliasReferenceVariable(prop) {
  if (typeof prop.$value === 'string' && prop.$value.startsWith('{') && prop.$value.endsWith('}')) {
    // Remove curly braces and replace dots with dashes
    let ref = prop.$value.slice(1, -1).replace(/\./g, '-');
    // Remove consecutive repeated words (e.g., border-border-radius-0 → border-radius-0)
    ref = removeConsecutiveRepeatedWords(ref);
    return `$${variablesPrefix}-${ref}`;
  }
  return null;
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
  // Use the original value to detect aliases
  const aliasVar = getAliasReferenceVariable({ $value: prop.original.$value });

  // Always generate the main variable
  let mainValue;
  if (aliasVar) {
    mainValue = `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${aliasVar});`;
  } else {
    mainValue = `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${prop.$value});`;
  }

  // Always generate the -rgb variable if it's a color
  const rgb = hexToRgb(prop.$value);
  let rgbDeclaration = '';
  if (rgb) {
    rgbDeclaration = `\n$${variablesPrefix}-${propName}-rgb: var(--${variablesPrefix}-${propName}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`;
  }

  return `${mainValue}${rgbDeclaration}`;
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
    letter-spacing: $${variablesPrefix}-font-letter-spacing-${extractLastPart(typography.letterSpacing) || 0}${_endChar}
    line-height: $${variablesPrefix}-font-line-height-${extractLastPart(typography.lineHeight)}${_endChar}
    text-transform: ${typography.textCase}${_endChar}
    text-decoration: ${typography.textDecoration}${_endChar}
  ${_endWrapper};
  `;
}

// Generates a color based css utility-class from a color Design Token structure
function generateColorUtilityClasses(prop, className) {
  const isBg = className.includes('bg');
  const cssProp = isBg ? 'background-color' : 'color';
  return `.${variablesPrefix}-${className} {
  --${cssProp}: $${variablesPrefix}-${prop.name};
  ${cssProp}: $${variablesPrefix}-${prop.name};
}`;
}

// Generates margin and padding utility classes to match the token-agnostic
// utilities provided by the Ionic Framework
function generateDefaultSpaceUtilityClasses() {
  const zeroMarginPaddingToken = 'space-0';
  const defaultMarginPaddingToken = 'space-400';

  const marginPaddingTemplate = (type) => `
.${variablesPrefix}-no-${type} {
  --${type}-top: #{$${variablesPrefix}-${zeroMarginPaddingToken}};
  --${type}-end: #{$${variablesPrefix}-${zeroMarginPaddingToken}};
  --${type}-bottom: #{$${variablesPrefix}-${zeroMarginPaddingToken}};
  --${type}-start: #{$${variablesPrefix}-${zeroMarginPaddingToken}};

  @include ${type}($${variablesPrefix}-${zeroMarginPaddingToken});
};

.${variablesPrefix}-${type} {
  --${type}-top: #{$${variablesPrefix}-${defaultMarginPaddingToken}};
  --${type}-end: #{$${variablesPrefix}-${defaultMarginPaddingToken}};
  --${type}-bottom: #{$${variablesPrefix}-${defaultMarginPaddingToken}};
  --${type}-start: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}($${variablesPrefix}-${defaultMarginPaddingToken});
};

.${variablesPrefix}-${type}-top {
  --${type}-top: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}($${variablesPrefix}-${defaultMarginPaddingToken}, null, null, null);
};

.${variablesPrefix}-${type}-end {
  --${type}-end: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, $${variablesPrefix}-${defaultMarginPaddingToken}, null, null);
};

.${variablesPrefix}-${type}-bottom {
  --${type}-bottom: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, null, $${variablesPrefix}-${defaultMarginPaddingToken}, null);
};

.${variablesPrefix}-${type}-start {
  --${type}-start: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, null, null, $${variablesPrefix}-${defaultMarginPaddingToken});
};

.${variablesPrefix}-${type}-vertical {
  --${type}-top: #{$${variablesPrefix}-${defaultMarginPaddingToken}};
  --${type}-bottom: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}($${variablesPrefix}-${defaultMarginPaddingToken}, null, $${variablesPrefix}-${defaultMarginPaddingToken}, null);
};

.${variablesPrefix}-${type}-horizontal {
  --${type}-start: #{$${variablesPrefix}-${defaultMarginPaddingToken}};
  --${type}-end: #{$${variablesPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, $${variablesPrefix}-${defaultMarginPaddingToken}, null, $${variablesPrefix}-${defaultMarginPaddingToken});
};
`;

  return `${marginPaddingTemplate('margin')}\n${marginPaddingTemplate('padding')}`;
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

  // Add gap utility classes for gap tokens
  const generateGapUtilityClasses = () =>`
.${variablesPrefix}-gap-${prop.name} { 
  gap: #{$${variablesPrefix}-${prop.name}}; 
};
`;

  return `${generateGapUtilityClasses()}\n${marginPaddingTemplate('margin')}\n${marginPaddingTemplate('padding')}`;
}

// Generates a valid box-shadow value from a shadow Design Token structure
function generateRadiusUtilityClasses(propName) {
  return `.${variablesPrefix}-${propName} {
  --border-radius: $${variablesPrefix}-${propName};
  border-radius: $${variablesPrefix}-${propName};
}`;
}

// Generates a border based css utility-class from a font Design Token structure
function generateBorderUtilityClasses(prop, propName) {
  let attribute;

  switch (prop.attributes.type) {
    case 'border-radius':
    case 'border-style':
      attribute = prop.attributes.type;
      break;
    case 'border-size':
      attribute = 'border-width';
      break;
    default:
      attribute = 'border-color';
  }
  return `.${variablesPrefix}-${propName} {
  --${attribute}: $${variablesPrefix}-${propName};
  ${attribute}: $${variablesPrefix}-${propName};
}`;
}

// Generates a font based css utility-class from a font Design Token structure
function generateFontUtilityClasses(prop, propName) {
  return `.${variablesPrefix}-${propName} {\n  ${prop.attributes.type}: $${variablesPrefix}-${propName};\n}`;
}

// Generates a valid box-shadow value from a shadow Design Token structure
function generateShadowUtilityClasses(propName) {
  return `.${variablesPrefix}-${propName} {
  --box-shadow: $${variablesPrefix}-${propName};
  box-shadow: $${variablesPrefix}-${propName};
}`;
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
    getAliasReferenceVariable,
    setPrefixValue,
    generateRadiusUtilityClasses,
    generateColorUtilityClasses,
    generateDefaultSpaceUtilityClasses,
    generateSpaceUtilityClasses,
    removeConsecutiveRepeatedWords,
    generateBorderUtilityClasses,
    generateFontUtilityClasses,
    generateShadowUtilityClasses,
    generateUtilityClasses
};
