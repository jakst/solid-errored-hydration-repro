# Solid 2 `<Errored>` fallback hydration repro

Minimal reproduction for Solid `2.0.0-rc.14`. An `<Errored>` fallback that shares a `{props.children}` slot with an async sibling is rendered twice on the server. The second render gets a shifted hydration key, so the fallback never hydrates and isn't interactive.

Reproduced and written by Claude Opus 5.5, from a bug we hit while migrating our application to Solid 2.

## Run

```sh
npm install
npm start
```

Open http://localhost:3000 (set `PORT` to use another port).

## What you'll see

- Clicking the button does nothing: it stays at "clicked 0 times".
- The console warns `Hydration key miss for "110"` and `Hydration completed with 1 unclaimed server-rendered node(s): <section _hk="112">…`.
- The server HTML has `<section _hk=112>`, but the client looks for `110`.

Delete `<Async />` in [`src/App.jsx`](src/App.jsx) and the button works, with no warnings.

## The fix we tested

In `solid-js`'s server `createErrorBoundary`, reset the output owner before each fallback render:

```diff
   const renderFallback = err => ctx ? runWithOwner(parent, () => {
+    disposeOwner(outputOwner, false);
     return runWithOwner(outputOwner, () => fallback(() => err, () => {}));
   }) : fallback(() => err, () => {});
```

With it, the fallback renders as `_hk="110"` and hydrates.
