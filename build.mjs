import { mkdir, copyFile, readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const openTag = '<script>';
const closeTag = '</script>';
const start = html.indexOf(openTag);
const end = html.lastIndexOf(closeTag);

if (start < 0 || end <= start) {
  throw new Error('Could not locate the inline application script in index.html');
}

// Parse the application script before publishing. A syntax error must fail the
// deployment build instead of shipping a blank page.
try {
  new Function(html.slice(start + openTag.length, end));
} catch (error) {
  throw new Error(`Application script has a syntax error: ${error.message}`);
}

await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
console.log('Built static demo; inline application JavaScript syntax is valid.');
