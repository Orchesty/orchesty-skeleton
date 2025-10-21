DC=docker compose
DR=$(DC) exec -T rabbitmq
DB=$(DC) exec -T backend
WORKER=$(DC) exec -T worker

ALIAS?=alias
.env:
	sed -e "s/{DEV_UID}/$(shell if [ "$(shell uname)" = "Linux" ]; then echo $(shell id -u); else echo '1001'; fi)/g" \
		-e "s/{DEV_GID}/$(shell if [ "$(shell uname)" = "Linux" ]; then echo $(shell id -g); else echo '1001'; fi)/g" \
		-e "s|{DOCKER_SOCKET_PATH}|$(shell test -S /var/run/docker-$${USER}.sock && echo /var/run/docker-$${USER}.sock || echo /var/run/docker.sock)|g" \
		-e "s|{PROJECT_SOURCE_PATH}|$(shell pwd)|g" \
		-e 's/{ORCHESTY_API_KEY}/$(shell export LC_CTYPE=C && tr -dc A-Za-z0-9 </dev/urandom | head -c 65)/g' \
		.env.dist > .env; \

init-dev: docker-up-force

# Docker section
docker-up-force: .env
	$(DC) pull --ignore-pull-failures
	$(DC) up -d --force-recreate --remove-orphans
	$(DR) rabbitmq-plugins enable rabbitmq_consistent_hash_exchange
	$(DC) restart rabbitmq
	$(DB) bin/console doctrine:mongodb:schema:update --dm default
	$(DB) bin/console doctrine:mongodb:schema:update --dm metrics
	$(DB) bin/console mongodb:index:update
	$(DB) bin/console service:install worker worker:8080
	$(DB) bin/console topology:install -c -u --force worker:8080
	$(DB) bin/console api-token:create --key "$(shell grep 'ORCHESTY_API_KEY' .env | cut -d "=" -f2)"
	$(DB) bin/console user:create "$(shell grep 'ORCHESTY_USER' .env | cut -d "=" -f2)" "$(shell grep 'ORCHESTY_PASSWORD' .env | cut -d "=" -f2)"

docker-down-clean: .env
	$(DC) down -v

docker-stop: .env
	$(DC) down
