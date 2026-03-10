# Генератор различий (gendiff)

[![CI](https://github.com/Noo001/frontend-project-46/actions/workflows/ci.yml/badge.svg)](https://github.com/Noo001/frontend-project-46/actions/workflows/ci.yml)
[![Test Coverage](https://api.sonarcloud.io/api/project_badges/measure?project=Noo001_frontend-project-46&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Noo001_frontend-project-46)
[![Maintainability Rating](https://api.sonarcloud.io/api/project_badges/measure?project=Noo001_frontend-project-46&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Noo001_frontend-project-46)
[![Reliability Rating](https://api.sonarcloud.io/api/project_badges/measure?project=Noo001_frontend-project-46&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Noo001_frontend-project-46)

Утилита командной строки для сравнения двух конфигурационных файлов (JSON, YAML) и вывода различий. Поддерживает рекурсивное сравнение вложенных структур и три формата вывода.

## Возможности

- Поддержка JSON и YAML форматов
- Рекурсивное сравнение вложенных структур
- Три формата вывода:
    - **stylish** (по умолчанию) - древовидная структура с символами + и -
    - **plain** - текстовый формат в стиле "было/стало"
    - **json** - машиночитаемый JSON формат
- Понятные сообщения об ошибках
- Интеграция с GitHub Actions и SonarCloud
- Полное покрытие тестами (>94%)

## Установка

```bash
# Клонировать репозиторий
git clone https://github.com/Noo001/frontend-project-46.git
cd frontend-project-46

# Установить зависимости
make install

# Создать глобальную ссылку (опционально)
make link