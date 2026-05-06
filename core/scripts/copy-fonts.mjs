import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const src = join(__dirname, '../node_modules/@phosphor-icons/web/src/regular');
const dest = join(__dirname, '../css/fonts');

mkdirSync(dest, { recursive: true });

['Phosphor.woff2', 'Phosphor.woff'].forEach((file) => {
  copyFileSync(join(src, file), join(dest, file));
});
