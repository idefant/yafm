# YAFM

YAFM - Yet Another Finance Manager

## Продакшн

### Все в одном

Рекомендуемый вариант развертывания - [Инструкция](https://github.com/idefant/yafm-installer/). Запуск контейнеров с фронтендом, api и валютным сервисом.

### Только фронтенд

1. Скопировать .env.sample в .env
2. Изменить параметры в .env под себя
3. Сбилдить и поднять фронтенд с заданными параметрами на порту 80:

```sh
docker build -t yafm-frontend .
docker run -d -p 80:80 yafm-frontend
```