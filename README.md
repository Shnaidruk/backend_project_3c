# BACK-End Labs

## Variant

15 mod 3 = 0

0 - Облік доходів

## Setup project

Щоб запустити проект локально, виконайте наступні кроки:

```bash
git clone https://github.com/Shnaidruk/backend_project_3c
cd backend_project_3c
docker-compose up --build
```

Команди щоб налагодити локальний сервер:
```bash
sudo docker ps -a

sudo docker exec -it backend_project_3c_postgres_1 psql -U postgres

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

sudo docker exec -it backend_project_3c_app_1 /bin/bash

npx sequelize-cli db:migrate
```



Посилання на деплой:

https://backend-project-3c.onrender.com/healthcheck
