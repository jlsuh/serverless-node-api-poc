BASE_COMPOSE=docker compose --env-file $(ENV_FILE)
ENV_FILE=./.env.development.local

all: start up

start:
	sudo service docker start

up:
	$(BASE_COMPOSE) up -d

dev:
	npm run initDb && npm run dev

down:
	$(BASE_COMPOSE) down --rmi all -v

stop:
	sudo service docker stop

.PHONY: all start up down stop
