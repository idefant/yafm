# YAFM

YAFM (Yet Another Finance Manager) - финансовый менеджер в браузере с e2e-шифрованием (AES)

## Переменные среды

|     | Параметр             | Описание                                                        | Значение по умолчанию |
| --- | -------------------- | --------------------------------------------------------------- | --------------------- |
| ❗   | BASE_URL             | Корневой адрес приложения                                       |                       |
| ❗   | EXRATES_API_URL      | Адрес сервиса [ExRates](https://github.com/idefant/exrates-api) |                       |
| ❗   | DATABASE_URL         | Connection URL для БД MySQL                                     |                       |
| ❗   | OIDC_ISSUER_BASE_URL | Корневой адрес провайдера OpenID Connect                        |                       |
| ❗   | OIDC_CLIENT_ID       | Client ID приложения                                            |                       |
| ❗   | OIDC_CLIENT_SECRET   | Client Secret приложения                                        |                       |
| ❗   | OIDC_COOKIE_SECRET   | Секрет для шифрования cookie                                    |                       |
|     | OIDC_ACCOUNT_URL     | Ссылка на профиль пользователя в IdP                            | (скрыто)              |
|     | OIDC_GROUP_USER      | Разрешенная группа пользователей                                | (разрешены любые)     |
| 🚧   | VITE_FRONTEND_PORT   | Порт фронтенда                                                  | 5173                  |
| 🚧   | BACKEND_PORT         | Порт бэкенда                                                    | 8080                  |
| 🚧   | VITE_API             | Адрес бэкенда                                                   | http://localhost:8080 |

Обозначения:
- ❗ - обязательные
- 🚧 - только для разработки

## OpenId Connect

Роуты OpenId Connect:

- Login - `/api/auth/login`
- Logout - `/api/auth/logout`
- Callback - `/api/auth/callback`

## Development

1. Установите переменные окружения командой `task dev-env`
2. Обновите переменные окружения в файле `.env`
3. Установите зависимости командой `task install`
4. Сгенерируйте базу данных командой `task gen-db`. Также существующую БД можно сбросить командой `task reset-db`
5. Запустите проект в dev-режиме командой `task dev`

## Сборка образа

```sh
# Собрать и поднять образ из исходного кода
docker compose up -d --build
```
