build:
	@docker-compose build server
.PHONY: build

run:
	@docker-compose run --service-ports --use-aliases server
.PHONY: run
