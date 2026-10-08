import { createServer } from "node:http";
import { createServer as createViteServer } from "vite";

const vite = await createViteServer({
  root: import.meta.dirname,
  server: { middlewareMode: true },
  appType: "custom",
});

const port = process.env.PORT ?? 3000;

createServer((req, res) => {
  vite.middlewares(req, res, async () => {
    const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
    res.setHeader("content-type", "text/html");
    res.end(await render());
  });
}).listen(port, () => console.log(`http://localhost:${port}`));

