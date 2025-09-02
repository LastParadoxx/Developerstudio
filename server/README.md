# Developer Studio API (Server)

This directory contains the back‑end component of Developer Studio v2. It is a Node.js application built with Express that exposes a simple REST API for language discovery, code execution and snippet management.

## Running the server

From the `developerstudio_v2/server` directory install dependencies and start the API:

```bash
npm install
npm run dev
```

By default the server listens on port `3001`. You can override this with the `PORT` environment variable:

```bash
PORT=4000 npm start
```

## Environment variables

The following environment variables influence the behaviour of the server:

| Variable            | Description                                                                                                      | Default                        |
|---------------------|------------------------------------------------------------------------------------------------------------------|---------------------------------|
| `PORT`              | Port on which the Express server listens.                                                                        | `3001`                          |
| `PISTON_BASE_URL`   | Base URL of the code execution service. The API must conform to the [Piston execute API](https://piston.rs/api). | `https://emkc.org/api/v2/piston`|
| `PISTON_TOKEN`      | Optional bearer token used when calling the code execution API.                                                  | none                            |

If you are running your own instance of [Piston](https://github.com/engineer‑man/piston) or another compatible execution engine, set `PISTON_BASE_URL` to your instance's URL. The `PISTON_TOKEN` is only required if the service is configured with token authentication.

## API Endpoints

### `GET /api/languages`

Returns a JSON array of objects representing supported runtimes. Each object has `language` and `version` fields. The server will call the configured code execution service (`PISTON_BASE_URL`), and if that fails it will fall back to a static list of common runtimes.

### `POST /api/run`

Executes submitted code in a selected language and version. The request body must include:

- `language` (string) – name of the language to run
- `code` (string) – source code to execute

Optionally the body can include:

- `version` (string) – specific language version to use
- `stdin` (string) – standard input passed to the program

On success returns the JSON response from the code execution service, which includes stdout, stderr and the exit code. If execution fails, a 500 status code is returned.

### `POST /api/snippets`

Saves a code snippet on the server and returns a unique `id`. The request body should contain:

- `code` (string) – the program source code
- `language` (string) – the language of the snippet (optional)

Snippets are stored in memory only. For a production deployment consider persisting them to disk or a database.

### `GET /api/snippets/:id`

Retrieves a snippet by its `id`. If the snippet doesn't exist the server returns a 404 error.

## Extending the server

The server is intentionally minimal to make it easy to extend. You can add additional routes under the `/api` prefix for features such as user authentication, file system operations or integration with other services. When storing user‑provided code on disk or executing it, always ensure the environment is appropriately sandboxed.