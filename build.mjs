import { mkdir, copyFile, readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/gi)];

if (scripts.length === 0) {
  throw new Error('No inline application script found in index.html');
}

// Parse every inline script before publishing. This catches malformed JavaScript
// that a static file-copy build would otherwise ship as a blank page.
for (const [index, match] of scripts.entries()) {
  try {
    new Function(match[1]);
  } catch (error) {
    throw new Error(`Inline script ${index + 1} has a syntax error: ${error.message}`);
  }
}

await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
console.log(`Built static demo; checked ${scripts.length} inline script(s).`);
