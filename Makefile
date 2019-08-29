build:
	@docker-compose build --no-cache server
.PHONY: build

run:
	@docker-compose run --service-ports --use-aliases server
.PHONY: run
