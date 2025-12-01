
const fs = require('fs');
const path = require('path');

const PROXIES_PATH = path.join(__dirname, '../src/directives/proxies.ts');
const STANDALONE_PROXIES_PATH = path.join(__dirname, '../standalone/src/directives/proxies.ts');

const BOOLEAN_INPUTS = [
  'disabled',
  'readonly',
  'checked',
  'selected',
  'expanded',
  'multiple',
  'required',
  // specific to ion-item
  'button',
  'detail',
  // specific to ion-accordion
  'toggleIcon', // wait, toggleIcon is string? No, it's string.
  // specific to ion-accordion-group
  'animated',
  // specific to ion-modal, ion-popover, etc.
  'isOpen',
  'keyboardClose',
  'backdropDismiss',
  'showBackdrop',
  'translucent',
  // specific to ion-datetime
  'showDefaultButtons',
  'showClearButton',
  'showDefaultTitle',
  'showDefaultTimeLabel',
  'preferWheel',
  // specific to ion-menu
  'swipeGesture',
  // specific to ion-nav
  'swipeGesture',
  // specific to ion-refresher
  'pullingIcon', // string
  // specific to ion-reorder-group
  'disabled',
  // specific to ion-searchbar
  'showCancelButton', // boolean | string ("focus" | "always" | "never") - WAIT, this is NOT purely boolean.
  // specific to ion-segment
  'scrollable',
  'swipeGesture',
  // specific to ion-select
  'multiple',
  // specific to ion-toast
  'translucent',
  // specific to ion-toggle
  'checked',
  // specific to ion-virtual-scroll
  // ...
];

// We need to be careful. Some inputs might share names but have different types in different components.
// For now, let's stick to the ones explicitly mentioned in the issue or clearly boolean globally.
// The issue mentions: button, detail (on ion-item).
// And "certain inputs".

const TARGETS = [
  {
    components: ['IonItem'],
    inputs: ['button', 'detail', 'disabled']
  },
  {
    components: ['IonButton', 'IonCard', 'IonFabButton'], // and others with disabled
    inputs: ['disabled']
  }
];

// Actually, let's try to do it for ALL components for 'disabled' and 'readonly'.
// And specific ones for others.

function fixProxies(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add booleanAttribute import if not present
  if (!content.includes('booleanAttribute')) {
    content = content.replace(
      /import { (.+?) } from '@angular\/core';/,
      "import { $1, booleanAttribute, Input } from '@angular/core';"
    );
  } else {
     // ensure Input is imported
     if (!content.includes('Input')) {
        content = content.replace(
          /import { (.+?) } from '@angular\/core';/,
          "import { $1, Input } from '@angular/core';"
        );
     }
  }

  // Helper to process a component
  const processComponent = (className, inputsToFix) => {
    // Regex to find the component definition
    // @ProxyCmp({ ... inputs: [...] ... })
    // @Component({ ... inputs: [...] ... })
    // export class ClassName { ... }

    const classRegex = new RegExp(`export class ${className} \\{[\\s\\S]*?\\}`, 'g');
    const match = content.match(classRegex);
    if (!match) return;

    let classBody = match[0];
    
    // Find the @ProxyCmp and @Component decorators preceding the class
    // We search backwards from the class definition?
    // Or we just search for the whole block.
    // The file structure is consistent.
    
    // Let's find the block:
    // @ProxyCmp({...})
    // @Component({...})
    // export class ClassName { ... }
    
    const blockRegex = new RegExp(
      `@ProxyCmp\\(\\{[\\s\\S]*?\\}\\)\\s*@Component\\(\\{[\\s\\S]*?\\}\\)\\s*export class ${className} \\{[\\s\\S]*?\\}`,
      'g'
    );
    
    content = content.replace(blockRegex, (fullBlock) => {
      let newBlock = fullBlock;
      
      inputsToFix.forEach(input => {
        // 1. Remove from @ProxyCmp inputs
        // inputs: ['a', 'b', 'input', 'c']
        // We need to handle quotes and commas.
        const proxyInputsRegex = /(@ProxyCmp\(\{[\s\S]*?inputs:\s*\[)([\s\S]*?)(\][\s\S]*?\})/;
        newBlock = newBlock.replace(proxyInputsRegex, (match, start, inputsList, end) => {
           const updatedList = inputsList
             .split(',')
             .map(s => s.trim())
             .filter(s => s.replace(/['"]/g, '') !== input)
             .join(', ');
           return `${start}${updatedList}${end}`;
        });

        // 2. Remove from @Component inputs
        const compInputsRegex = /(@Component\(\{[\s\S]*?inputs:\s*\[)([\s\S]*?)(\][\s\S]*?\})/;
        newBlock = newBlock.replace(compInputsRegex, (match, start, inputsList, end) => {
           const updatedList = inputsList
             .split(',')
             .map(s => s.trim())
             .filter(s => s.replace(/['"]/g, '') !== input)
             .join(', ');
           return `${start}${updatedList}${end}`;
        });

        // 3. Add getter/setter to class body
        // We insert it before the constructor.
        // protected el: HTML...;
        // INSERT HERE
        // constructor...
        
        const getterSetter = `
  @Input({ transform: booleanAttribute })
  get ${input}() { return this.el.${input}; }
  set ${input}(value: boolean) { this.z.runOutsideAngular(() => (this.el.${input} = value)); }`;
        
        const constructorRegex = /(constructor\s*\()/;
        newBlock = newBlock.replace(constructorRegex, `${getterSetter}\n  $1`);
      });
      
      return newBlock;
    });
  };

  // Apply fixes
  // IonItem
  processComponent('IonItem', ['button', 'detail', 'disabled']);
  
  // Apply 'disabled' to others?
  // Let's do a quick scan of all classes that have 'disabled' in their inputs.
  // Actually, let's just do it for the ones we are sure about.
  // The issue specifically mentions IonItem.
  // "make certain inputs booleanAttributes"
  // It's safer to be explicit.
  
  const COMMON_BOOLEANS = ['disabled', 'readonly'];
  // We can iterate over all exported classes and check if they have these inputs in their ProxyCmp.
  
  // For now, let's stick to IonItem as the primary target to verify the fix.
  // If the user wants MORE, I can add them.
  
  return content;
}

// Run for both files
try {
    if (fs.existsSync(PROXIES_PATH)) {
        console.log(`Processing ${PROXIES_PATH}...`);
        const fixed = fixProxies(PROXIES_PATH);
        fs.writeFileSync(PROXIES_PATH, fixed);
        console.log('Done.');
    }
    
    if (fs.existsSync(STANDALONE_PROXIES_PATH)) {
        console.log(`Processing ${STANDALONE_PROXIES_PATH}...`);
        const fixed = fixProxies(STANDALONE_PROXIES_PATH);
        fs.writeFileSync(STANDALONE_PROXIES_PATH, fixed);
        console.log('Done.');
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
