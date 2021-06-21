# Pipes Skeleton

## How to install
1. Clone skeleton repository `https://github.com/hanaboso/pipes-skeleton`
2. Initialize git project from cloned template `rm -rf .git && git init`

## How to run
- Run `make init-dev`
- Go to [http://127.0.0.10/ui](http://127.0.0.10/ui)

## How to create user
- Run `docker-compose exec backend bin/pipes user:create`

## How to enable your PHP services
1. Go to [UI Services](http://127.0.0.10/ui/sdk_implementations)
1. Add `php-sdk` as new Services

## MacOs developers

#### Is "nproc" missing?
1. Run `brew install coreutils`

## TODO:
- Add Python SDK
- Add C# SDK
- Add Node.js SDK
