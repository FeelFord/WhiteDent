import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const root = resolve("out");
const port = Number(process.argv.find(arg => arg.startsWith("--port="))?.split("=")[1] ?? 3200);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/WhiteDent";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
await stat(resolve(root, "index.html"));

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }); response.end(); return;
    }
    if (pathname === basePath && basePath) {
      response.writeHead(301, { Location: `${basePath}/${url.search}` }); response.end(); return;
    }
    if (!pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404); response.end("Not found"); return;
    }
    const relativePath = pathname.slice(basePath.length);
    let file = resolve(root, `.${relativePath}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403); response.end(); return;
    }
    try {
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith("/")) {
          response.writeHead(301, { Location: `${pathname}/${url.search}` }); response.end(); return;
        }
        file = resolve(file, "index.html");
      }
      const body = await readFile(file);
      response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : await readFile(resolve(root, "404.html")));
    }
  } catch {
    response.writeHead(400); response.end("Bad request");
  }
}).listen(port, "0.0.0.0", () => console.log(`Static WhiteDent preview: port ${port}, base path ${basePath || "/"}`));
