import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const server = spawn(process.execPath, ['scripts/preview.mjs', '--port', '0'], { stdio: ['ignore', 'pipe', 'pipe'] });
let stderr = '';
server.stderr.on('data', (chunk) => { stderr += chunk; });
try {
  const base = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview failed to start: ' + stderr)), 10000);
    server.once('exit', () => { clearTimeout(timeout); reject(new Error(stderr || 'Preview exited early')); });
    server.stdout.on('data', (chunk) => {
      const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url) { clearTimeout(timeout); resolve(url); }
    });
  });
  const page = await fetch(base);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /<main[ >]/, 'Main content exists');
  for (const title of ['ABOUT ME', 'WHAT I CAN DO', 'WHAT I HAVE DONE', 'COLLABORATORS']) assert.ok(html.includes(title), 'Missing original section: ' + title);
  const paths = new Set([...html.matchAll(/(?:src|href|poster)="(\/[^"#]*)"/g)].map((match) => match[1].replaceAll('&amp;', '&')));
  for (const path of paths) {
    const response = await fetch(base + path, { method: 'HEAD' });
    assert.equal(response.status, 200, 'Broken link or asset: ' + path);
  }
  const videoPath = html.match(/<video\b[^>]*\bsrc="([^"]+)"/)?.[1];
  assert.ok(videoPath, 'The exported page has a video source');
  const part = await fetch(base + videoPath, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(part.status, 206); assert.equal((await part.arrayBuffer()).byteLength, 1024);
  const invalid = await fetch(base + videoPath, { headers: { Range: 'bytes=999999999-' } });
  assert.equal(invalid.status, 416);
  assert.equal((await fetch(base + '/not-a-real-file')).status, 404);
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  assert.equal((await fetch(base + '/%2e%2e%5cpackage.json')).status, 403);
  console.log(`PASS: ${paths.size} local links/assets; main landmarks; video range requests; missing-file, method and path protections.`);
} finally {
  if (server.exitCode === null) { server.kill(); await once(server, 'exit'); }
}
