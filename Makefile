.PHONY: help install link test test-coverage lint lint-fix ci

NODE = node
FIXTURES_DIR = __fixtures__

help:				## Показать справку
	$(NODE) bin/gendiff.js -h

install:			## Установка зависимостей
	npm ci

link: install		## Создать глобальную ссылку
	npm link

test:				## Запустить тесты
	npm test

test-coverage:		## Запустить тесты с покрытием
	npm run test:coverage

test-watch:			## Запустить тесты в режиме watch
	npm run test:watch

lint:				## Запустить линтер
	npm run lint

lint-fix:			## Исправить ошибки линтера
	npm run lint:fix

ci: lint test		## Запустить все проверки для CI

start:				## Запуск с аргументами
	$(NODE) bin/gendiff.js $(ARGS)

# Показать все команды
list:
	@echo "Доступные команды:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'