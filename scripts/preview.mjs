import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';
const root = resolve(fileURLToPath(new URL('../out/', import.meta.url)));
const flag = process.argv.indexOf('--port');
const port = Number(flag >= 0 ? process.argv[flag + 1] : process.env.PORT || 3000);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.ico':'image/x-icon', '.woff2':'font/woff2', '.pdf':'application/pdf', '.mp4':'video/mp4', '.json':'application/json' };
try { await stat(resolve(root, 'index.html')); } catch { console.error('Run npm run build before starting the preview.'); process.exit(1); }
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(403).end(); return; }
    let info = await stat(file);
    if (info.isDirectory()) { file = resolve(file, 'index.html'); info = await stat(file); }
    const type = mime[extname(file)] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', pathname.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable' : 'no-cache');
    res.setHeader('Accept-Ranges', 'bytes');
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
      if (start >= info.size || end < start) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') res.end(); else createReadStream(file, { start, end }).pipe(res);
    } else if (/text|javascript|json|svg/.test(type) && req.headers['accept-encoding']?.includes('gzip')) {
      res.writeHead(200, { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
      if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(createGzip()).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Length': info.size });
      if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
    }
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${server.address().port}`));
