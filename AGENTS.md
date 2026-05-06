# Orchesty Skeleton — AI Instructions

This project uses the [`@orchesty/nodejs-ai`](https://github.com/Orchesty/orchesty-nodejs-ai) package to provide AI coding rules for the worker. The rules teach AI assistants how to build Applications, Connectors, Batches, CustomNodes, tests, and topology files for Orchesty.

## First-time setup

The package is installed in [`worker/`](worker/), so the rule files live at:

```
worker/node_modules/@orchesty/nodejs-ai/rules/*.mdc
```

Materialize the rules into your AI tool's native location. Run from the skeleton root:

### Cursor

```bash
mkdir -p .cursor/rules
cp worker/node_modules/@orchesty/nodejs-ai/rules/*.mdc .cursor/rules/
```

### Other tools

For Claude Code, Windsurf, GitHub Copilot, Cline, Aider, etc., follow the per-tool steps in [`worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md`](worker/node_modules/@orchesty/nodejs-ai/AI-INSTRUCTIONS.md), but swap every path prefix `node_modules/@orchesty/nodejs-ai/` with `worker/node_modules/@orchesty/nodejs-ai/`.

## After updating the package

When `@orchesty/nodejs-ai` gets a new version, refresh both the install and the materialized rules:

```bash
cd worker && pnpm update @orchesty/nodejs-ai && cd ..
cp worker/node_modules/@orchesty/nodejs-ai/rules/*.mdc .cursor/rules/
```

## Rules

| File | Purpose |
|------|---------|
| `orchesty-project.mdc` | Architecture, component registration, payload flow |
| `orchesty-naming.mdc` | Naming conventions, directory structure |
| `orchesty-connectors.mdc` | Connector, batch, and custom node patterns |
| `orchesty-applications.mdc` | Application (auth provider) patterns |
| `orchesty-testing.mdc` | Testing patterns, NodeTester, mock fixtures |
| `orchesty-topologies.mdc` | Topology JSON file format |

Each file uses YAML frontmatter (`alwaysApply`, `globs`, `description`) so Cursor's native rule engine scopes rules to the right files automatically (e.g. connector rules fire on `worker/src/**/*.ts`).
