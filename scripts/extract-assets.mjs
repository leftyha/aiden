import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

const marker = resolve('public/assets/backgrounds/dawn.webp');
if (existsSync(marker)) process.exit(0);
const parts = Array.from({ length: 8 }, (_, i) => resolve(`assets-bundle/part-${String(i).padStart(2, '0')}`));
if (!parts.every(existsSync)) throw new Error('Faltan partes del bundle de assets');
const archive = resolve('.assets.tar.gz');
const encoded = parts.map((part) => readFileSync(part, 'utf8')).join('').trim();
writeFileSync(archive, Buffer.from(encoded, 'base64'));
mkdirSync(dirname(marker), { recursive: true });
execFileSync('tar', ['-xzf', archive], { stdio: 'inherit' });
console.log('Assets de Mi primer rugido extraídos.');
