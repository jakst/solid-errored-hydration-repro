import { generateHydrationScript, renderToStream } from "@solidjs/web";
import { App } from "./App";

export function render() {
  return new Promise((resolve) => {
    let body = "";
    renderToStream(() => <App />).pipe({
      write: (chunk) => {
        body += chunk;
      },
      end: () =>
        resolve(
          `<!doctype html><html><head>${generateHydrationScript()}</head><body><div id="app">${body}</div><script type="module" src="/src/entry-client.jsx"></script></body></html>`,
        ),
    });
  });
}
