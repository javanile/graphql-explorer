.PHONY: build

build:
	@chmod +x docker-entrypoint.sh
	@docker compose build -q graphql-explorer

build-dist:
	@docker compose build -q build-dist
	@docker compose run --rm build-dist sh -c "yarn install && npm run build"

build-server:
	@docker compose build graphql-server

start: build
	@docker compose up -d --force-recreate graphql-explorer graphql-server
	@echo
	@echo "Open this page in your browser: <http://localhost:5677>"

stop:
	@docker compose down

release:
	@date > tests/RELEASE
	@git add .
	@git commit -am "New release!"
	@git push
	@docker login -u yafb
	@docker build -t "javanile/graphql-explorer:v1" .
	@docker push "javanile/graphql-explorer:v1"
