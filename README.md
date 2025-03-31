# YAFM

YAFM - Yet Another Finance Manager

## Переменные среды

|     | Параметр           | Описание                                 | Значение по умолчанию |
| --- | ------------------ | ---------------------------------------- | --------------------- |
| ❗   | VITE_EXRATES_API   | Адрес сервиса ExRates                    |                       |
|     | VITE_ACCOUNT_URL   | Ссылка на профиль пользователя в IdP     | (скрыто)              |
| ❗   | DATABASE_URL       | Connection URL для БД MySQL              |                       |
| ❗   | ISSUER_BASE_URL    | Корневой адрес провайдера OpenID Connect |                       |
| ❗   | CLIENT_ID          | Client ID приложения                     |                       |
| ❗   | CLIENT_SECRET      | Client Secret приложения                 |                       |
| ❗   | BASE_URL           | Корневой адрес приложения                |                       |
| ❗   | SECRET             | Секрет для шифрования cookie             |                       |
|     | GROUP_USER         | Разрешенная группа пользователей         | (разрешены любые)     |
| 🚧   | VITE_FRONTEND_PORT | Порт фронтенда                           | 5173                  |
| 🚧   | BACKEND_PORT       | Порт бэкенда                             | 8080                  |
| 🚧   | VITE_API           | Адрес бэкенда                            | http://localhost:8080 |

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
