.PHONY: build

build:
	@chmod +x docker-entrypoint.sh
	@docker compose build

build-dist:
	@docker compose build -q build-dist
	@docker compose run --rm build-dist sh -c "npm install && npm run build"

start: build
	@docker compose up

release:
	@date > tests/RELEASE
	@git add .
	@git commit -am "New release!"
	@git push
	@docker login -u yafb
	@docker build -t "javanile/graphql-explorer:v1" .
	@docker push "javanile/graphql-explorer:v1"
