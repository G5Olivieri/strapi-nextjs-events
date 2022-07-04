up:
	docker-compose up -d

down:
	docker-compose kill
	docker-compose rm -f

shell:
	docker-compose run --rm strapi sh

logs:
	docker-compose logs -f --tail 1000 strapi
