import { execFileSync } from 'child_process';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';

const cssDir = join(__dirname, '..');
const sassCli = join(dirname(require.resolve('sass')), 'sass.js');

/**
 * Compiles through the sass CLI, the same way `npm run css.sass` builds
 * the published stylesheets. The sass JS API can't be imported here
 * because it detects the spec window and never populates its exports.
 */
const compileStylesheet = (file: string) =>
  execFileSync(process.execPath, [sassCli, '--style=compressed', '--no-source-map', join(cssDir, file)], {
    encoding: 'utf8',
  });

const globalStylesheets = ['.', 'palettes'].flatMap((dir) =>
  readdirSync(join(cssDir, dir))
    .filter((file) => file.endsWith('.scss'))
    .map((file) => join(dir, file))
);

describe('global stylesheets', () => {
  // https://github.com/ionic-team/ionic-framework/issues/30024
  it.each(globalStylesheets)('%s should not contain :host-context', (file) => {
    expect(compileStylesheet(file)).not.toContain(':host-context');
  });

  it('float-elements.scss should flip start and end floats for an ancestor dir=rtl', () => {
    const css = compileStylesheet('float-elements.scss');

    expect(css).toContain('[dir=rtl] .ion-float-start{float:right !important}');
    expect(css).toContain('[dir=rtl] .ion-float-end{float:left !important}');
    expect(css).toContain('.ion-float-start:dir(rtl){float:right !important}');
    expect(css).toContain('.ion-float-end:dir(rtl){float:left !important}');
  });
});
