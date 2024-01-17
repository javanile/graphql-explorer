.PHONY: build

build:
	@chmod +x docker-entrypoint.sh
	@docker compose build

start: build
	@docker compose up

release:
	@date > tests/RELEASE
	@git add .
	@git commit -am "New release!"
	@git push
	@docker login -u yafb
	@docker build -t "javanile/graphql-explorer:latest" .
	@docker push "javanile/graphql-explorer:latest"
