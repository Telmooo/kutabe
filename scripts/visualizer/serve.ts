import { readFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const PORT = Number(process.env.PORT) || 3456;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".wasm": "application/wasm",
};

const ROUTES: Record<string, string> = {
  "/": path.join(ROOT, "scripts/visualizer/index.html"),
  "/index.html": path.join(ROOT, "scripts/visualizer/index.html"),
  "/web-tree-sitter.js": path.join(
    ROOT,
    "node_modules/web-tree-sitter/web-tree-sitter.js",
  ),
};

const server = createServer(async (request, response) => {
  const url = request.url ?? "/";

  let filePath = ROUTES[url];

  // Serve WASM files from dist/wasm/
  if (!filePath && url.startsWith("/wasm/")) {
    const fileName = path.basename(url);
    filePath = path.join(ROOT, "dist/wasm", fileName);
  }

  if (!filePath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Kutabe AST Visualizer running at http://localhost:${PORT}`);
});
