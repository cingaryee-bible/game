// Development only: ordinary static file serving, no accounts or save API.
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || 4173;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // A local-only mount to verify GitHub's /repository/ URL layout.
    if (pathname.startsWith('/project-preview/')) pathname = pathname.slice('/project-preview'.length);
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) {res.writeHead(403);res.end();return;}
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    res.end(body);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain'});res.end('Not found');
  }
}).listen(port, '0.0.0.0', () => console.log(`Static preview ready on ${port}`));
