# YAFM

YAFM - Yet Another Finance Manager

## Продакшн

1. Скопировать .env.sample в .env
2. Изменить параметры в .env под себя
3. Сбилдить и поднять фронтенд с заданными параметрами на порту 80:

```sh
docker build -t yafm-frontend .
docker run -d -p 80:80 yafm-frontend
```