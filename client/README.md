# Developer Studio Client

This directory contains the front‑end of Developer Studio v2. It is a React application built with [Vite](https://vitejs.dev/) and powered by the [Monaco Editor](https://github.com/microsoft/monaco-editor). The app communicates with the back‑end API via REST calls to perform tasks such as fetching supported languages, executing code and managing snippets.

## Running the client

Install dependencies and start the development server:

```bash
cd developerstudio_v2/client
npm install
npm run dev
```

During development the client proxies all `/api` requests to the API server. By default the proxy target is `http://localhost:3001`. You can customise this by creating a `.env` file in the `client` folder and setting `VITE_API_BASE_URL` to the desired URL.

To build the application for production run:

```bash
npm run build
```

This will output static assets to the `dist/` directory which can be served by any HTTP server or integrated with the Node API server.

## Main Components

- **App.jsx** – The top‑level component that orchestrates state (language, code, theme) and ties the UI together.
- **LanguageSelector.jsx** – Presents a dropdown of languages and versions. Handles selection and notifies its parent via callbacks.
- **EditorPane.jsx** – Encapsulates the Monaco code editor. Supports dynamic language switching and theme changes.
- **OutputPane.jsx** – Renders program output, separating stdout and stderr with distinct styles.

## Customisation

You can extend the client in many ways:

- Add support for user authentication to associate snippets with accounts.
- Integrate additional editor features (linting, formatting, code completion) by enabling Monaco plugins or integrating [LSP](https://microsoft.github.io/language-server-protocol/).
- Persist user settings (theme, last used language) to local storage.
- Improve the UI with frameworks like [Tailwind CSS](https://tailwindcss.com/) or [Material UI](https://mui.com/).