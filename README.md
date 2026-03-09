# Генератор различий (gendiff)

[![CI](https://github.com/Noo001/frontend-project-46/actions/workflows/ci.yml/badge.svg)](https://github.com/Noo001/frontend-project-46/actions/workflows/ci.yml)
[![Test Coverage](https://api.sonarcloud.io/api/project_badges/measure?project=Noo001_frontend-project-46&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Noo001_frontend-project-46)

Утилита командной строки для сравнения двух конфигурационных файлов (JSON, YAML) и вывода различий.

## Поддерживаемые форматы файлов

- JSON (`.json`)
- YAML (`.yml`, `.yaml`)

## Форматы вывода

- **stylish** (по умолчанию) - древовидная структура с символами + и -
- **plain** - текстовый формат в стиле "было/стало"

## Установка

```bash
# Клонировать репозиторий
git clone https://github.com/Noo001/frontend-project-46.git
cd frontend-project-46

# Установить зависимости
make install

# Создать глобальную ссылку (опционально)
make link