let variablesPrefix; // Variable that holds the prefix used on all css variables generated
let classAndScssPrefix; // Variable that holds the prefix used on all css utility-classes and scss variables generated  

// Set the variable prefix value
export function setVariablePrefixValue(prefix) {
  variablesPrefix = prefix;
  return variablesPrefix;
}

export function setClassesAndScssPrefixValue(prefix) {
  classAndScssPrefix = prefix;
  return classAndScssPrefix;
}

// Generates a valid rgba() color
export function getRgbaValue(propValue) {
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
export function hexToRgb(hex) {
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
export function removeConsecutiveRepeatedWords(str) {
    return str.replace(/(\b\w+\b)(-\1)+/g, '$1');
}

// Generates a reference variable for an alias token type
// (e.g., $ion-border-default: var(--ion-border-default, #d5d5d5) → $ion-border-default: var(--ion-border-default, $ion-primitives-neutral-400))
export function getAliasReferenceVariable(prop) {
  if (typeof prop.$value === 'string' && prop.$value.startsWith('{') && prop.$value.endsWith('}')) {
    // Remove curly braces and replace dots with dashes
    let ref = prop.$value.slice(1, -1).replace(/\./g, '-');
    // Remove consecutive repeated words (e.g., border-border-radius-0 → border-radius-0)
    ref = removeConsecutiveRepeatedWords(ref);
    return `$${classAndScssPrefix}-${ref}`;
  }
  return null;
}

// Generates a valid box-shadow value from a shadow Design Token structure
export function generateShadowValue(prop, propName) {
  const cssShadow = prop.$value.map(shadow => {
    // Assuming shadow is an object with properties like offsetX, offsetY, blurRadius, spreadRadius, color
    const color = getRgbaValue(shadow.color);
    return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${color}`;
}).join(', ');

  return `$${classAndScssPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${cssShadow});`;
}

// Generates a valid font-size value from a font-size Design Token structure, while transforming the pixels to rem
export function generateFontSizeValue(prop, propName, variableType = 'css') {
  return variableType === 'scss'
    ? `$${classAndScssPrefix}-${propName}: var(--${variablesPrefix}-${propName}, font.px-to-rem(${parseInt(
        prop.$value
      )}));`
    : `--${propName}: #{font.px-to-rem(${parseInt(prop.$value)})};`;
}

// Generates a valid font-family value from a font-family Design Token structure
export function generateFontFamilyValue(prop, propName, variableType = 'css') {
  // Remove the last word from the token, as it contains the name of the font, which we don't want to be included on the generated variables
  const _propName = propName.split('-').slice(0, -1).join('-');

  return variableType === 'scss'
    ? `$${classAndScssPrefix}-${_propName}: var(--${variablesPrefix}-${_propName}, ${prop.$value});`
    : `--${variablesPrefix}-${_propName}: ${prop.$value};`;
}

// Generates a final value, based if the Design Token is of type color or not
export function generateValue(prop, propName) {
  // Use the original value to detect aliases
  const aliasVar = getAliasReferenceVariable({ $value: prop.original.$value });

  // Always generate the main variable
  let mainValue;
  if (aliasVar) {
    mainValue = `$${classAndScssPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${aliasVar});`;
  } else {
    mainValue = `$${classAndScssPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${prop.$value});`;
  }

  // Always generate the -rgb variable if it's a color
  const rgb = hexToRgb(prop.$value);
  let rgbDeclaration = '';
  if (rgb) {
    rgbDeclaration = `\n$${classAndScssPrefix}-${propName}-rgb: var(--${variablesPrefix}-${propName}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`;
  }

  return `${mainValue}${rgbDeclaration}`;
}

// Generates a typography based css utility-class or scss variable from a typography token structure
export function generateTypographyOutput(prop, propName, isVariable) {
  const typography = prop.original.$value;

  // Extract the part after the last dot and trim any extraneous characters
  const extractLastPart = (str) => str.split('.').pop().replace(/[^\w-]/g, '');

  const _initialWrapper = isVariable ? ': (' : ` {`;
  const _endWrapper = isVariable ? ')' : `}`;
  const _prefix = isVariable ? '$' : `.`;
  const _endChar = isVariable ? ',' : ';';

  // This exact format is needed so that it compiles the tokens with the expected lint rules
  return `
  ${_prefix}${classAndScssPrefix}-${propName}${_initialWrapper}
    font-size: $${classAndScssPrefix}-font-size-${extractLastPart(typography.fontSize)}${_endChar}
    font-style: ${prop.attributes.item?.toLowerCase() === 'italic' ? 'italic' : 'normal'}${_endChar}
    font-weight: $${classAndScssPrefix}-font-weight-${extractLastPart(typography.fontWeight)}${_endChar}
    letter-spacing: $${classAndScssPrefix}-font-letter-spacing-${extractLastPart(typography.letterSpacing) || 0}${_endChar}
    line-height: $${classAndScssPrefix}-font-line-height-${extractLastPart(typography.lineHeight)}${_endChar}
    text-transform: ${typography.textCase}${_endChar}
    text-decoration: ${typography.textDecoration}${_endChar}
  ${_endWrapper};
  `;
}

// Generates a color based css utility-class from a color Design Token structure
export function generateColorUtilityClasses(prop, className) {
  const isBg = className.includes('bg');
  const cssProp = isBg ? 'background-color' : 'color';
  return `.${classAndScssPrefix}-${className} {
  --${cssProp}: #{$${classAndScssPrefix}-${prop.name}};
  ${cssProp}: $${classAndScssPrefix}-${prop.name};
}`;
}

// Generates margin and padding utility classes to match the token-agnostic
// utilities provided by the Ionic Framework
export function generateDefaultSpaceUtilityClasses() {
  const zeroMarginPaddingToken = 'space-0';
  const defaultMarginPaddingToken = 'space-400';

  const marginPaddingTemplate = (type) => `
.${classAndScssPrefix}-no-${type} {
  --${type}-top: #{$${classAndScssPrefix}-${zeroMarginPaddingToken}};
  --${type}-end: #{$${classAndScssPrefix}-${zeroMarginPaddingToken}};
  --${type}-bottom: #{$${classAndScssPrefix}-${zeroMarginPaddingToken}};
  --${type}-start: #{$${classAndScssPrefix}-${zeroMarginPaddingToken}};

  @include ${type}($${classAndScssPrefix}-${zeroMarginPaddingToken});
};

.${classAndScssPrefix}-${type} {
  --${type}-top: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};
  --${type}-end: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};
  --${type}-bottom: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};
  --${type}-start: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}($${classAndScssPrefix}-${defaultMarginPaddingToken});
};

.${classAndScssPrefix}-${type}-top {
  --${type}-top: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}($${classAndScssPrefix}-${defaultMarginPaddingToken}, null, null, null);
};

.${classAndScssPrefix}-${type}-end {
  --${type}-end: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, $${classAndScssPrefix}-${defaultMarginPaddingToken}, null, null);
};

.${classAndScssPrefix}-${type}-bottom {
  --${type}-bottom: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, null, $${classAndScssPrefix}-${defaultMarginPaddingToken}, null);
};

.${classAndScssPrefix}-${type}-start {
  --${type}-start: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, null, null, $${classAndScssPrefix}-${defaultMarginPaddingToken});
};

.${classAndScssPrefix}-${type}-vertical {
  --${type}-top: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};
  --${type}-bottom: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}($${classAndScssPrefix}-${defaultMarginPaddingToken}, null, $${classAndScssPrefix}-${defaultMarginPaddingToken}, null);
};

.${classAndScssPrefix}-${type}-horizontal {
  --${type}-start: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};
  --${type}-end: #{$${classAndScssPrefix}-${defaultMarginPaddingToken}};

  @include ${type}(null, $${classAndScssPrefix}-${defaultMarginPaddingToken}, null, $${classAndScssPrefix}-${defaultMarginPaddingToken});
};
`;

  return `${marginPaddingTemplate('margin')}\n${marginPaddingTemplate('padding')}`;
}

// Generates a margin or padding based css utility-class from a space Design Token structure
export function generateSpaceUtilityClasses(prop, className) {
  // This exact format is needed so that it compiles the tokens with the expected lint rules
  // It will generate classes for margin and padding, for equal sizing on all side and each direction
  const marginPaddingTemplate = (type) => `
.${classAndScssPrefix}-${type}-${className} {
  --${type}-top: #{$${classAndScssPrefix}-${prop.name}};
  --${type}-end: #{$${classAndScssPrefix}-${prop.name}};
  --${type}-bottom: #{$${classAndScssPrefix}-${prop.name}};
  --${type}-start: #{$${classAndScssPrefix}-${prop.name}};

  @include ${type}($${classAndScssPrefix}-${prop.name});
};

.${classAndScssPrefix}-${type}-top-${className} {
  --${type}-top: #{$${classAndScssPrefix}-${prop.name}};

  @include ${type}($${classAndScssPrefix}-${prop.name}, null, null, null);
};

.${classAndScssPrefix}-${type}-end-${className} {
  --${type}-end: #{$${classAndScssPrefix}-${prop.name}};

  @include ${type}(null, $${classAndScssPrefix}-${prop.name}, null, null);
};

.${classAndScssPrefix}-${type}-bottom-${className} {
  --${type}-bottom: #{$${classAndScssPrefix}-${prop.name}};

  @include ${type}(null, null, $${classAndScssPrefix}-${prop.name}, null);
};

.${classAndScssPrefix}-${type}-start-${className} {
  --${type}-start: #{$${classAndScssPrefix}-${prop.name}};

  @include ${type}(null, null, null, $${classAndScssPrefix}-${prop.name});
};
`;

  // Add gap utility classes for gap tokens
  const generateGapUtilityClasses = () =>`
.${classAndScssPrefix}-gap-${prop.name} { 
  gap: #{$${classAndScssPrefix}-${prop.name}}; 
};
`;

  return `${generateGapUtilityClasses()}\n${marginPaddingTemplate('margin')}\n${marginPaddingTemplate('padding')}`;
}

// Generates a valid box-shadow value from a shadow Design Token structure
export function generateRadiusUtilityClasses(propName) {
  return `.${classAndScssPrefix}-${propName} {
  --border-radius: $${classAndScssPrefix}-${propName};
  border-radius: $${classAndScssPrefix}-${propName};
}`;
}

// Generates a border based css utility-class from a font Design Token structure
export function generateBorderUtilityClasses(prop, propName) {
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
  return `.${classAndScssPrefix}-${propName} {
  --${attribute}: $${classAndScssPrefix}-${propName};
  ${attribute}: $${classAndScssPrefix}-${propName};
}`;
}

// Generates a font based css utility-class from a font Design Token structure
export function generateFontUtilityClasses(prop, propName) {
  return `.${classAndScssPrefix}-${propName} {\n  ${prop.attributes.type}: $${classAndScssPrefix}-${propName};\n}`;
}

// Generates a valid box-shadow value from a shadow Design Token structure
export function generateShadowUtilityClasses(propName) {
  return `.${classAndScssPrefix}-${propName} {
  --box-shadow: $${classAndScssPrefix}-${propName};
  box-shadow: $${classAndScssPrefix}-${propName};
}`;
}

// Generates a utility class for a given token category and name
export function generateUtilityClasses(tokenCategory, propName){
  return `.${classAndScssPrefix}-${propName} {\n  ${tokenCategory}: $${classAndScssPrefix}-${propName};\n}`;
}