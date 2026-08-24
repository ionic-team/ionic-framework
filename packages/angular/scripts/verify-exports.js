const fs = require('fs');
const path = require('path');

/**
 * Verify exports for individual standalone components.
 */

const PROJECT_ROOT = path.join(__dirname, '../../..');
const CORE_COMPONENTS_DIR = path.join(PROJECT_ROOT, 'core/src/components');
const ANGULAR_PACKAGE_JSON = path.join(PROJECT_ROOT, 'packages/angular/package.json');
const ANGULAR_ROOT = path.join(PROJECT_ROOT, 'packages/angular');
const KNOWN_EXCLUDED_COMPONENTS = [
  'ion-route',
  'ion-route-redirect',
  'ion-router',
  'ion-select-popover',
  'ion-slides',
];
const KNOWN_NON_CORE_ION_COMPONENTS  = [
  'ion-modal-token'
]

function getComponentsFromCore() {
  const componentsList = fs.readdirSync(CORE_COMPONENTS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => `ion-${entry.name}`)
    .sort();
  return new Set(componentsList);
}

function getPackageExports() {
  const packageJson = JSON.parse(fs.readFileSync(ANGULAR_PACKAGE_JSON));
  return packageJson.exports;
}

function getIonExports(packageExports) {
  const ionComponentExports = {};
  for (const [exportPath, exportValue] of Object.entries(packageExports)) {
    if (exportPath.startsWith('./ion-')) {
      const componentName = exportPath.slice(2); // Remove "./"
      ionComponentExports[componentName] = exportValue;
    }
  }
  return ionComponentExports;
}

function verify() {
  const coreComponents = getComponentsFromCore();
  const packageExports = getPackageExports();
  const ionExports = getIonExports(packageExports);
  let hasErrors = false;

  // Check for components in core that are missing from exports
  const missingFromExports = [];
  for (const component of coreComponents) {
    if (!ionExports[component]) {
      if (!KNOWN_EXCLUDED_COMPONENTS.includes(component)) {
        console.log(`missing ${component} export in package.json`);
        hasErrors = true;
      }
    }
  }

  // Check for exports that don't have a corresponding component in core
  for (const exportName of Object.keys(ionExports)) {
    if (!coreComponents.has(exportName) && !KNOWN_NON_CORE_ION_COMPONENTS.includes(exportName)) {
      console.log(`${exportName} is exported without a matching component in core.`);
      hasErrors = true;
    }
  }

  // Check if exported files exist
  for (const [exportName, relativePath] of Object.entries(packageExports)) {
    if (typeof relativePath === "string") {
      const fullPath = path.join(ANGULAR_ROOT, relativePath);
      if (!fs.existsSync(fullPath)) {
        console.log(`${exportName} points to a path that does not exist (${relativePath})`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    process.exitCode = 1;
  } else {
    console.log('✅ verified package.json');
  }
}

verify();
