# Orchesty Skeleton

## How to install
1. Clone skeleton repository `https://github.com/Orchesty/orchesty-skeleton`
2. Initialize git project from cloned template `rm -rf .git && git init`

## How to run
- Run `make init-dev`
- Go to [http://127.0.0.10](http://127.0.0.10)
- Login with credentials stored in .env (default: test@orchesty.io | password)

## How to enable your PHP services
1. Go to [UI Workers](http://127.0.0.10/workers)
2. Add `php-sdk` as new Worker:
   1. URL: `php-sdk:80`
   2. Name: `php-sdk`

## How to enable your Node.JS services
1. Go to [UI Workers](http://127.0.0.10/workers)
2. Add `nodejs-sdk` as new Workers
   1. URL: `nodejs-sdk:8080`
   2. Name: `nodejs-sdk`

## MacOs developers

#### Is "nproc" missing?
1. Run `brew install coreutils`
