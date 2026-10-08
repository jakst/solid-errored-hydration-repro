import { createMemo, createSignal, Errored } from "solid-js";

export function App() {
  return (
    <Layout>
      <Errored fallback={() => <Fallback />}>
        <Throws />
      </Errored>
      <Async />
    </Layout>
  );
}

function Layout(props) {
  return <main>{props.children}</main>;
}

function Throws() {
  throw new Error("boom");
}

function Async() {
  const value = createMemo(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return "async content";
  });
  return <p>{value()}</p>;
}

function Fallback() {
  const [count, setCount] = createSignal(0);
  return (
    <section>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        clicked {count()} times
      </button>
    </section>
  );
}
