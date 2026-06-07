# Tarea 1: Makefile para comandos repetitivos

dev:
	tsx watch --env-file=.env index.ts

seed:
	tsx prisma/seed.ts

registrar:
	tsx registra_usuarios.ts

scrape:
	node scrap-tp.js

db-up:
	docker compose up -d

db-down:
	docker compose down

db-studio:
	npx prisma studio

migrate:
	npx prisma migrate dev
	npx prisma generate

prod-up:
	docker compose -f docker-compose-prod.yml up -d

prod-down:
	docker compose -f docker-compose-prod.yml down
