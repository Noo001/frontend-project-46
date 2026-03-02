install:
	npm ci
gendiff:
	node bin/gendiff.js
lint:
	npx eslint
.PHONY: test