# Staticit - React Example

After creating the `.staticit.json` and your desired routes. Just add the rehydration steps to your React app.

- [main.tsx](src/main.tsx) - (React 18)

```ts
const rootElement = document.getElementById('root');

if (rootElement?.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement!,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootElement!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

- After that add a postbuild step to your [`package.json`](package.json).

```json
"scripts": {
  ...
  "postbuild": "staticit"
}
```

Staticit will run after build and will generate the static files that you've defined.
