# Orchesty Skeleton

A ready-to-fork starter for running [Orchesty](https://orchesty.io) Community Edition locally with a Node.js worker. The skeleton wires the entire stack (Admin UI, backend, MongoDB, RabbitMQ, supporting services, plus a worker container) into a single Docker Compose project, driven by a one-line `make init-dev`. The worker subfolder ships with the [`@orchesty/nodejs-sdk`](https://www.npmjs.com/package/@orchesty/nodejs-sdk) and the [`@orchesty/nodejs-ai`](https://github.com/Orchesty/orchesty-nodejs-ai) rules package so AI coding assistants generate code that matches Orchesty conventions out of the box.

Use this skeleton when you want the whole platform on your machine. If you only need a worker connected to an existing Orchesty instance, use [`orchesty-nodejs-bootstrap`](https://github.com/Orchesty/orchesty-nodejs-bootstrap) instead.

## Quickstart with AI tools (Cursor, Claude Code, ...)

This is the recommended path. Open your AI coding tool inside an empty folder, paste the prompt below, and let the agent run the setup. The agent clones the repo, runs `make init-dev`, verifies the Admin UI is up, and materializes the AI rules into its native rule directory.

```
Spin up Orchesty Community Edition with a Node.js worker locally.

1. Clone https://github.com/Orchesty/orchesty-skeleton.git into the current directory (no `my-orchesty` subfolder), then `rm -rf .git && git init`.
2. Open AGENTS.md and follow its "Setup workflow" section in order. It checks that Docker is available, runs `make init-dev` (renders `.env`, brings up the platform, registers the worker, installs topologies), verifies http://127.0.0.1, and materializes the AI rules from `worker/node_modules/@orchesty/nodejs-ai/` into your tool's native rule directory.
```

Per-tool rule paths and the update flow live in [`worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md`](https://github.com/Orchesty/orchesty-nodejs-ai/blob/master/AI-INSTRUCTIONS.md) once the worker container is up.

## Manual quickstart (without AI)

Requirements: Docker Desktop (macOS / Windows) or Docker engine + compose plugin (Linux), `make`, and 4 GB of free RAM for the stack.

```bash
git clone https://github.com/Orchesty/orchesty-skeleton.git my-orchesty
cd my-orchesty
rm -rf .git && git init
make init-dev
```

Then open `http://127.0.0.1`. On first start the Admin UI shows an onboarding flow that creates the initial account; subsequent visits show the regular login screen.

`make init-dev` is idempotent and one-shot. It generates `.env` from `.env.dist`, pulls and starts every service, enables the RabbitMQ `consistent_hash_exchange` plugin, applies MongoDB schemas, registers the bundled `worker` container with the platform, installs any topology JSON files in `topology/`, and issues an API token. First run takes several minutes (image pulls); re-runs are fast.

The AI rule files in `worker/node_modules/@orchesty/nodejs-ai/rules/` only matter when you drive the codebase with an AI coding assistant. Plain manual development can ignore them.

## Project structure

```
.
├── docker-compose.yml      # Platform services + the worker container
├── Makefile                # Canonical entry point. See "Make targets" below
├── AGENTS.md               # Setup workflow for AI agents (Cursor, Claude Code, ...)
├── .env.dist               # Template; `make init-dev` auto-generates `.env` from this
├── topology/               # Exported topology JSON, auto-installed by `make init-dev`
└── worker/                 # Node.js worker subfolder
    ├── src/
    │   └── index.ts        # Worker entry point: register Applications and Nodes here
    ├── Dockerfile          # Worker container image
    ├── docker-compose.yaml # Worker-only compose for standalone container ops
    ├── Makefile            # Worker-scoped targets (install, start, lint, test, ...)
    ├── package.json        # Pulls @orchesty/nodejs-sdk + @orchesty/nodejs-ai (dev)
    ├── .env.dist
    └── tsconfig*.json
```

You own `worker/` and `topology/`. Everything else is platform-owned and is updated by pulling new skeleton releases.

## Make targets (root)

| Target | What it does |
| --- | --- |
| `make init-dev` | One-shot bootstrap: `.env`, pull, up, RabbitMQ plugin, schemas, register worker, install topology, issue API token. Idempotent. |
| `make docker-up-force` | Re-pull and recreate the stack without re-running schema/topology setup. |
| `make docker-stop` | `docker compose down`. Stops containers, **keeps** data volumes. |
| `make docker-down-clean` | `docker compose down -v`. Stops containers **and deletes** data volumes. Destructive. |

## Make targets (worker)

Run from `worker/`. They proxy commands into the running worker container:

| Target | What it does |
| --- | --- |
| `make install` | `pnpm install` inside the worker container. |
| `make update` | `pnpm update` inside the worker container. |
| `make start` | Start (or restart) the SDK process inside the worker container. |
| `make lint` | ESLint with `--fix`. |
| `make unit` | Jest unit tests. |
| `make fasttest` | `lint` + `unit`. |
| `make test` | Bring up the container, run `install` + `fasttest`, then `docker compose down -v`. |

For day-to-day code edits, the SDK runner picks up changes automatically. `make install` is only needed after `package.json` changes; `make start` restarts the SDK process explicitly.

## Docker workflow

`make init-dev` brings up the full stack with bind mounts on `worker/` and `topology/`, so host edits propagate inside the containers. Stop containers with `make docker-stop` (data preserved) or `make docker-down-clean` (data destroyed). The exposed ports follow [`.env.dist`](.env.dist):

- `127.0.0.1:80` — Admin UI (Frontend)
- `127.0.0.1:81` — Backend API
- `127.0.0.1:82` — Starting Point
- `127.0.0.1:15672` — RabbitMQ management
- `127.0.0.1:27017` — MongoDB

## How AI rules work

The rules ship as the npm package [`@orchesty/nodejs-ai`](https://github.com/Orchesty/orchesty-nodejs-ai), pinned in `worker/package.json` as a dev dependency. When you use this skeleton with an AI coding assistant, [`AGENTS.md`](AGENTS.md) tells the agent to materialize the `.mdc` rule files from `worker/node_modules/@orchesty/nodejs-ai/rules/` into the tool's native rule directory; per-tool snippets (Cursor's `.cursor/rules/`, Claude Code's `CLAUDE.md`, Windsurf's `.windsurfrules`, etc.) live in [`worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md`](https://github.com/Orchesty/orchesty-nodejs-ai/blob/master/AI-INSTRUCTIONS.md). Paths in that file assume the worker root, so prefix every `node_modules/...` path with `worker/`.

To pull rule updates: `cd worker && pnpm update @orchesty/nodejs-ai && cd ..`, then ask your AI tool to re-run the AGENTS.md setup workflow (or copy the refreshed `.mdc` files yourself).

## Documentation

- [Orchesty platform docs](https://docs.orchesty.io/)
- [Full-stack setup guide (orchesty.io)](https://orchesty.io/docs/2.0/getting-started/full-stack-setup/overview)
- [`@orchesty/nodejs-sdk` on npm](https://www.npmjs.com/package/@orchesty/nodejs-sdk)
- [Pre-built `@orchesty/connector-*` packages](https://www.npmjs.com/search?q=%40orchesty%2Fconnector)
- [Connector source examples](https://github.com/Orchesty/orchesty-nodejs-connectors/tree/master/lib)

## Community

- [Discord](https://discord.gg/orchesty)
- [GitHub Discussions](https://github.com/Orchesty/orchesty-skeleton/discussions)
- Issues and pull requests welcome. Please run the worker's `make test` before opening a PR.

## License

Apache-2.0. See [LICENSE](LICENSE).
