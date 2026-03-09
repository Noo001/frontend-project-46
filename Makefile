.PHONY: help install link test test-coverage lint lint-fix ci clean

NODE = node
SHELL := $(shell which powershell.exe 2>/dev/null || echo bash)

# Определяем ОС
ifeq ($(OS),Windows_NT)
    RM = del /Q /F
    RMDIR = rmdir /S /Q
    NPM = npm.cmd
    TEST_CMD = set NODE_OPTIONS=--experimental-vm-modules && npx jest
else
    RM = rm -f
    RMDIR = rm -rf
    NPM = npm
    TEST_CMD = NODE_OPTIONS=--experimental-vm-modules npx jest
endif

help:				## Показать справку
	$(NODE) bin/gendiff.js -h

install:			## Установка зависимостей
	$(NPM) install

link: install		## Создать глобальную ссылку
	$(NPM) link

test:				## Запустить тесты
	$(TEST_CMD)

test-coverage:		## Запустить тесты с покрытием
	$(TEST_CMD) --coverage

test-watch:			## Запустить тесты в режиме watch
	$(TEST_CMD) --watch

lint:				## Запустить линтер
	npx eslint .

lint-fix:			## Исправить ошибки линтера
	npx eslint . --fix

ci: lint test		## Запустить все проверки для CI

clean:				## Очистить зависимости
	$(RMDIR) node_modules
	$(RM) package-lock.json

start:				## Запуск с аргументами
	$(NODE) bin/gendiff.js $(ARGS)

# Показать все команды
list:
	@echo "Доступные команды:"
	@echo ""
ifeq ($(OS),Windows_NT)
	@for %%i in (help install link test test-coverage test-watch lint lint-fix ci clean start) do @echo   %%-i
else
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
endif