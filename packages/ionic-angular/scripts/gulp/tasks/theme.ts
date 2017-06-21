import { task } from 'gulp';
import { SRC_ROOT, SRC_COMPONENTS_ROOT } from '../constants';
import * as path from 'path';
import * as fs from 'fs';

task('theme', (done: () => void) => {
  let opts: GenerateThemeOptions = {
    src: path.join(SRC_COMPONENTS_ROOT),
    dest: path.join(SRC_ROOT, 'ionic-generate.scss')
  };
  generateThemeSource(opts);
});


export function generateThemeSource(opts: GenerateThemeOptions) {
  console.log(`[theme] src: ${opts.src}`);
  console.log(`[theme] desc: ${opts.dest}`);

  let components = getSourceComponents(opts);
  generateManifest(opts, components);
}


function generateManifest(opts: GenerateThemeOptions, components: Component[]) {

  components.forEach(c => {
    console.log(c.name);

    c.modes.forEach(m => {
      console.log(`   ${m.mode}  ${m.src}`);
    });

  });

}


function getSourceComponents(opts: GenerateThemeOptions) {
  let components: Component[] = [];

  function readFiles(src: string, fillFiles: string[]) {
    fs.readdirSync(src).forEach((file, index) => {
      var filePath = path.join(src, file);
      var fsStats = fs.statSync(filePath);
      if (fsStats.isDirectory()) {
        readFiles(filePath, fillFiles);
      } else if (fsStats.isFile()) {
        fillFiles.push(filePath);
      }
    });
  }

  let files: string[] = [];
  readFiles(opts.src, files);

  files = files.filter(f => f.slice(-5) === '.scss');
  files.sort();

  files.forEach(f => {
    var componentRoot = f.replace(opts.src + '/', '');
    var fileSplit = componentRoot.split('/');
    var componentName = fileSplit[0];
    var fileName = fileSplit[1];

    var component = components.find(c => c.name === componentName);
    if (!component) {
      component = {
        name: componentName,
        modes: []
      };
      components.push(component);
    }

    fileSplit = fileName.split('.');
    if (fileSplit.length === 3) {
      component.modes.push({
        src: f,
        mode: fileSplit[1]
      });

    } else {
      component.modes.unshift({
        src: f,
        mode: DEFAULT_MODE
      });
    }

  });

  console.log(`[theme] components: ${components.length}`);

  return components;
}


export interface GenerateThemeOptions {
  src: string;
  dest: string;
  includeModes?: string[];
  excludeModes?: string[];
  includeComponents?: string[];
  excludeComponents?: string[];
}

export interface Component {
  name: string;
  modes: FileDetails[];
}

export interface FileDetails {
  src: string;
  mode: string;
}

const DEFAULT_MODE = '*';
