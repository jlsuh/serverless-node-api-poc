ENV_FILE=./.env.development.local

all: start up

start:
	sudo service docker start

up:
	docker compose --env-file $(ENV_FILE) up -d

down:
	docker compose --env-file $(ENV_FILE) down --rmi all -v

stop:
	sudo service docker stop

.PHONY: all start up down stop
