import { createReadStream, stat } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 5500);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.otf': 'font/otf', '.ttf': 'font/ttf'
};

createServer((request, response) => {
  const pathname = decodeURIComponent(request.url.split('?')[0]);
  const file = resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
  if (!file.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  stat(file, (error, details) => {
    if (error || !details.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(response);
  });
}).listen(port, '127.0.0.1', () => console.log(`Serving http://127.0.0.1:${port}`));
