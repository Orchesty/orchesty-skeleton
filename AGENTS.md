# Orchesty Skeleton — AI Instructions

This skeleton brings up the entire Orchesty Community Edition stack locally (Admin UI, backend, MongoDB, RabbitMQ, supporting services) plus a Node.js worker container, all wired by [`docker-compose.yml`](docker-compose.yml) and the root [`Makefile`](Makefile). The worker subfolder ([`worker/`](worker/)) ships with the [`@orchesty/nodejs-ai`](https://github.com/Orchesty/orchesty-nodejs-ai) package as a dev dependency, so AI coding assistants (Cursor, Claude Code, Windsurf, GitHub Copilot, Cline, Aider, ...) can generate Applications, Connectors, Batches, CustomNodes, tests, and topology files that follow Orchesty conventions.

## Setup workflow

Execute these steps in order. The skeleton requires Docker; the worker runs as a service inside the compose stack, so a host Node.js install is **not** needed.

1. **Pre-flight: Docker.** Run `docker --version` and `docker compose version` (silently). If either is missing, stop and tell the user to install Docker Desktop (macOS / Windows) or the Docker engine + compose plugin (Linux) before continuing. The stack expects 4 GB of free RAM.
2. **Bring up the stack.** Run `make init-dev` from the skeleton root. This is idempotent and one-shot:
   - renders `.env` from [`.env.dist`](.env.dist) (your UID/GID, a random `ORCHESTY_API_KEY`, default `DEV_IP`, default ports),
   - `docker compose pull && docker compose up -d --force-recreate --remove-orphans`,
   - enables the RabbitMQ `consistent_hash_exchange` plugin,
   - updates MongoDB schemas and indexes,
   - registers the bundled `worker` container with the platform (`service:install worker worker:8080`),
   - installs any topology JSON files found in [`topology/`](topology/),
   - issues an API token from `ORCHESTY_API_KEY` for the worker.

   First run takes several minutes (image pulls, schema setup). Subsequent runs are fast. If your tool can run shell commands in the background, start `make init-dev` in the background and continue with the next step while it runs.
3. **Verify.** Once the stack is up, the Admin UI is on `http://127.0.0.1`. On first start it shows an onboarding flow that creates the initial account; subsequent visits show a regular login. If the page does not load, check `docker compose ps` and `docker compose logs -f backend frontend worker` — `backend`, `frontend`, and `worker` must all be `Up`.
4. **Materialize the AI rules into your tool.** The rule package is installed inside the worker container (and on the host bind-mount) at `worker/node_modules/@orchesty/nodejs-ai/`. Open [`worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md`](worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md) and run the copy/concat snippet for the tool you're using (Cursor, Claude Code, Windsurf, GitHub Copilot, Cline, Aider, ...). The snippets in that file assume paths relative to the worker root, so prefix every `node_modules/@orchesty/nodejs-ai/...` path with `worker/`. For example, the Cursor snippet becomes:

   ```bash
   mkdir -p .cursor/rules
   cp worker/node_modules/@orchesty/nodejs-ai/rules/*.mdc .cursor/rules/
   ```

   Without this step the architectural / naming / connector rules are not active in your editor.

The skeleton is now ready to host integration code in [`worker/src/`](worker/src/). Editing files there triggers nodemon inside the worker container; the platform reconnects within a few seconds.

## After updating the rules package

When `@orchesty/nodejs-ai` ships a new version, refresh the install inside the worker and re-materialize:

```bash
cd worker && pnpm update @orchesty/nodejs-ai && cd ..
# then re-run the copy/concat snippet from
# worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md
```

## Make targets (root)

| Target | What it does |
| --- | --- |
| `make init-dev` | One-shot bootstrap: `.env`, pull, up, RabbitMQ plugin, schemas, register worker, install topology, issue API token. Idempotent. |
| `make docker-up-force` | Re-pull and recreate the stack without re-running schema/topology setup. |
| `make docker-stop` | `docker compose down` — stop containers, **keep** data volumes. |
| `make docker-down-clean` | `docker compose down -v` — stop containers **and delete** data volumes. Destructive. |

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

For day-to-day code edits, the dev runner picks up changes automatically. You only need `make install` after `package.json` changes and `make start` to restart the SDK process explicitly.

## Rules

The full per-rule list and YAML-frontmatter conventions live in the [`@orchesty/nodejs-ai` README](https://github.com/Orchesty/orchesty-nodejs-ai). The pack covers project architecture, naming, applications, connectors, batches, custom nodes, testing, and topology JSON.
