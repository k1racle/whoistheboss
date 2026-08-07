# Релиз и Docker-деплой

Документ описывает сборку и ререлиз Nuxt 4-приложения `guessboss` через Docker Compose и Portainer. Инструкция сохраняет существующие PostgreSQL-данные и загруженные файлы при переходе с legacy Express-сайта.

Статус документа на 7 августа 2026 года: черновик по данным репозитория и фактического прогона деплоя. Production использует Portainer Stack `whoistheboss`. Push в Git не запускает деплой автоматически: после push оператор вручную обновляет существующий Stack в Portainer. Фактические имена production volumes ещё нужно подтвердить у ответственного за инфраструктуру.

## Главные правила

- Push или merge в `main` только публикует новый код в Git и сам по себе не меняет production.
- Production обновляется только после ручного запуска деплоя существующего Stack `whoistheboss` в Portainer.
- Не отправляйте изменения в `main`, пока не созданы и не проверены бэкапы PostgreSQL и uploads.
- Не меняйте имя существующего Portainer Stack во время ререлиза.
- Не удаляйте Stack вместе с volumes и не выполняйте `docker compose down -v`.
- Не запускайте seed-команды в production.
- Используйте только `npm`, `npm exec` или `npx` для Node.js-команд.
- Оставляйте `SPLASH_ENABLED=true` до завершения production smoke-check.
- Фиксируйте исходный и новый Git commit для каждого деплоя.

## Production-архитектура

Текущий `docker-compose.yml` поднимает приложение и PostgreSQL в одной Docker-сети:

```text
Portainer Stack
├── guessboss-app
│   ├── Nuxt 4 / Nitro node-server
│   ├── встроенная SPA-админка /admin
│   └── volume uploads → /app/public/uploads
└── guessboss-db
    └── volume postgres_data → /var/lib/postgresql/data
```

Compose публикует порт приложения и ожидает reverse proxy перед контейнером. Конфигурация TLS, домена, CDN и HTML-кэширования находится вне репозитория и требует отдельного подтверждения.

### Постоянные данные

Production-контент состоит из двух независимых частей:

| Данные | Расположение | Что содержит |
| --- | --- | --- |
| PostgreSQL | Volume `postgres_data` | Пользователей, контент, настройки сайта, связи и Prisma migration history. |
| Uploads | Volume `uploads` | Загруженные изображения, видео и другие медиафайлы. |

Пересборка `guessboss-app` не удаляет эти данные, пока Portainer подключает прежние volumes. Изменение Stack name может создать новые volumes с другими именами и показать пустую БД или пустую медиатеку.

## Как собирается Docker image

`Dockerfile` использует два этапа.

### Builder

Builder выполняет следующую последовательность:

1. Использует Node.js 24 LTS на Debian Bookworm. Nuxt 4.5.1 требует Node.js 22.19+, 24.11+ или 26+.
2. Устанавливает системные зависимости для Prisma и нативных Node.js-пакетов.
3. Копирует `package.json`, `package-lock.json` и Prisma schema.
4. Выполняет `npm ci`.
5. Копирует исходный код.
6. Выполняет `npx prisma generate`.
7. Выполняет `npm run build`.

`npm run build` сначала собирает SPA-админку в `dist/admin`, затем собирает Nuxt/Nitro в `.output`.

### Runner

Production-слой копирует:

```dockerfile
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
```

Этот набор достаточен для текущего приложения:

- `.output` содержит Nitro server и собранную публичную часть;
- `node_modules` содержит runtime dependencies и Prisma CLI;
- `prisma` содержит schema и SQL-миграции;
- `public` нужен серверному upload-handler, который читает `/app/public/uploads`;
- `scripts/docker-entrypoint.sh` применяет миграции и запускает сервер.

Копирование всего `node_modules` увеличивает образ, но не блокирует релиз. Оптимизацию production dependencies следует выполнять отдельно от ререлиза.

## Что происходит при старте контейнера

Entrypoint выполняет команды последовательно:

```sh
npx prisma generate
npx prisma migrate deploy
node .output/server/index.mjs
```

`prisma generate` создаёт Prisma Client и не обращается к данным БД. `prisma migrate deploy` применяет только ещё не применённые SQL-миграции, не выполняет reset и не запускает seed.

На момент подготовки документа ветки `main` и `nuxt-migration` содержат одинаковые Prisma schema и SQL-миграции. Если production использует актуальную `main`, новый Nuxt-контейнер не должен применять schema-изменения. Перед релизом это предположение необходимо подтвердить через `prisma migrate status`.

## Environment variables

Portainer должен хранить production-значения в Environment variables Stack. Не добавляйте production-секреты в Git, Dockerfile или `.env.example`.

### Обязательные переменные Docker Compose

| Переменная | Назначение |
| --- | --- |
| `NODE_ENV=production` | Включает production-режим. |
| `PORT` | Задаёт порт Nitro и опубликованный порт контейнера. |
| `POSTGRES_USER` | Задаёт пользователя PostgreSQL. |
| `POSTGRES_PASSWORD` | Задаёт пароль PostgreSQL. |
| `POSTGRES_DB` | Задаёт имя базы. |
| `DATABASE_URL` | Формируется compose для соединения Prisma с сервисом `db`. |
| `SESSION_SECRET` | Существующий legacy-секрет сессии длиной не менее 32 символов. |
| `SITE_URL` | Содержит канонический production URL. |
| `SITE_NAME` | Содержит название сайта. |
| `SITE_DESCRIPTION` | Содержит описание сайта. |

### Nuxt runtime bridging

Nuxt runtime config переопределяет значения через переменные `NUXT_*`. Отдельный новый session secret не нужен, но compose должен передать существующее значение под Nuxt-именем:

```yaml
environment:
  SESSION_SECRET: ${SESSION_SECRET}
  NUXT_SESSION_PASSWORD: ${SESSION_SECRET}
  NUXT_PUBLIC_SITE_URL: ${SITE_URL}
  NUXT_PUBLIC_SITE_NAME: ${SITE_NAME}
  NUXT_PUBLIC_SITE_DESCRIPTION: ${SITE_DESCRIPTION}
```

Без `NUXT_SESSION_PASSWORD` production build может получить пустой пароль H3-сессии. В этом случае login и обновление cookie завершатся ошибкой, потому что H3 требует пароль длиной не менее 32 символов.

Legacy-cookie `sid` и новая cookie `nuxt-session` несовместимы. Первый Nuxt-деплой потребует один повторный вход в админку, но не изменит пользователей или контент в PostgreSQL.

### Дополнительные переменные

Compose также передаёт настройки uploads, SMTP, Telegram и уведомлений:

- `UPLOAD_DIR` и `MAX_UPLOAD_SIZE_MB`;
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`;
- `FROM_EMAIL` и `ADMIN_EMAIL`;
- `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.

Текущая Nuxt-версия сохраняет заявку на съёмку в PostgreSQL, но ещё не переносит legacy email- и Telegram-уведомления. Наличие environment variables не означает, что уведомления уже работают.

## Ручной деплой через Portainer

Push в `main` не запускает production-деплой. После push оператор открывает существующий [Portainer Stack `whoistheboss`](https://185.72.147.187:9443/#!/3/docker/stacks/whoistheboss?id=52&type=2&regular=true&orphaned=false&orphanedRunning=false) и вручную запускает его обновление из Git.

Перед запуском обновления оператор проверяет, что открыт именно Stack `whoistheboss`, а не создаёт новый Stack. Также нужно проверить отслеживаемую ветку и убедиться, что Portainer получил ожидаемый release commit. Затем оператор запускает redeploy/update и наблюдает полный build log до завершения операции.

Перед первым ререлизом ответственный за инфраструктуру должен зафиксировать:

- Git repository URL и отслеживаемую ветку;
- текущий deployed commit;
- фактические имена volumes;
- адрес reverse proxy и правила кэширования;
- способ повторного развёртывания предыдущего commit.

## Подготовка release candidate

Выполните проверки в release-ветке до merge в `main`:

```powershell
npm install
npm run lint
npm run typecheck
npm run build
```

Dev- и preview-серверы не входят в обязательную автоматическую проверку. Для браузерного smoke-check запросите отдельное разрешение владельца перед запуском `npm run dev` или `npm run preview`.

Зафиксируйте состояние release candidate:

```powershell
git status --short
git rev-parse HEAD
git log -1 --oneline
```

Рабочее дерево должно содержать только согласованные release-изменения. Запишите commit в release log до production-деплоя.

## Pre-release backup

Рабочих production-бэкапов на момент подготовки документа нет. Первый ререлиз запрещён до создания пары `PostgreSQL dump + uploads copy` и проверки обеих копий.

### Подготовка backup window

1. Согласуйте короткое окно без редактирования контента.
2. Попросите контент-мейкеров сохранить работу и выйти из форм редактирования.
3. Запишите текущий deployed commit.
4. Запишите имена Stack, app-контейнера, db-контейнера и volumes.
5. Создайте каталог бэкапа вне Docker volumes.

Пример каталога на production host:

```sh
mkdir -p ./backups/guessboss-YYYYMMDD-HHMM
```

### PostgreSQL

Снимите custom-format dump из работающего PostgreSQL-контейнера:

```sh
docker exec guessboss-db pg_dump \
  --username=<POSTGRES_USER> \
  --dbname=<POSTGRES_DB> \
  --format=custom \
  > ./backups/guessboss-YYYYMMDD-HHMM/database.dump
```

Проверьте, что файл существует, не пуст и читается `pg_restore`:

```sh
ls -lh ./backups/guessboss-YYYYMMDD-HHMM/database.dump
pg_restore --list ./backups/guessboss-YYYYMMDD-HHMM/database.dump > /dev/null
```

Проверка списка не заменяет тестовое восстановление. После ререлиза нужно добавить регулярную проверку restore в отдельную тестовую БД.

### Uploads

Скопируйте содержимое подключённого uploads volume через app-контейнер:

```sh
docker cp \
  guessboss-app:/app/public/uploads \
  ./backups/guessboss-YYYYMMDD-HHMM/uploads
```

Проверьте количество файлов и общий размер:

```sh
find ./backups/guessboss-YYYYMMDD-HHMM/uploads -type f | wc -l
du -sh ./backups/guessboss-YYYYMMDD-HHMM/uploads
```

Храните копию за пределами Docker host или синхронизируйте её во внешнее резервное хранилище. Бэкап на том же диске не защищает от потери host.

### Результат backup

Запишите в release log:

- время начала и окончания окна;
- путь к database dump;
- путь к uploads copy;
- размеры и количество файлов;
- deployed commit;
- имя оператора;
- результат проверки dump.

После проверки разрешите контент-мейкерам продолжить работу либо сразу переходите к деплою. Если между backup и деплоем снова разрешена запись, перед release потребуется новый согласованный snapshot.

## Проверка Prisma перед деплоем

Проверьте состояние миграций в текущем app-контейнере:

```sh
docker exec guessboss-app npx prisma migrate status
```

Остановите release, если Prisma сообщает о failed migration, diverged history или неизвестных production-изменениях. Не применяйте `prisma migrate reset`, `prisma db push --force-reset` или seed-команды к production-БД.

## Ререлиз под сплэш-экраном

### Перед merge

Убедитесь, что выполнены все условия:

- `SPLASH_ENABLED=true` в production `SiteSetting`;
- PostgreSQL dump проверен;
- uploads скопированы и проверены;
- release commit зафиксирован;
- `npm run lint`, `npm run typecheck` и `npm run build` проходят;
- compose передаёт `NUXT_SESSION_PASSWORD`;
- согласованы роли, которые видят публичный preview сквозь сплэш;
- известен способ app-only rollback на предыдущий commit.

### Запуск

1. Выполните согласованный merge release-ветки в `main` и отправьте commit в Git.
2. Откройте [Portainer Stack `whoistheboss`](https://185.72.147.187:9443/#!/3/docker/stacks/whoistheboss?id=52&type=2&regular=true&orphaned=false&orphanedRunning=false).
3. Проверьте отслеживаемую ветку и ожидаемый release commit.
4. Вручную запустите обновление/redeploy существующего Stack из Git.
5. Не создавайте новый Stack и не меняйте имя существующего.
6. Убедитесь, что Portainer повторно подключает прежние `postgres_data` и `uploads` volumes.
7. Дождитесь завершения Docker build и сохраните полный build log при ошибке.
8. Проверьте в логах успешный `prisma migrate deploy`.
9. Дождитесь healthy-состояния `guessboss-app`.

### Проверка контейнеров

Используйте production host или Portainer UI:

```sh
docker ps --filter name=guessboss
docker logs --tail 200 guessboss-app
docker inspect --format='{{json .State.Health}}' guessboss-app
```

Логи entrypoint должны содержать этапы Prisma generate, migration deploy и запуск приложения. Контейнер не должен находиться в restart loop.

## Smoke-check после деплоя

Оставьте сплэш включённым и проверьте:

1. `/health` возвращает успешный JSON-ответ.
2. Гость видит сплэш на `/`, `/companies`, `/businesses` и detail-странице.
3. `/admin/` загружает SPA-админку.
4. Admin login создаёт новую `nuxt-session` cookie.
5. `/api/auth/me` возвращает авторизованного пользователя.
6. `/api/admin/*` сохраняет прежний JSON contract.
7. Администратор или согласованная preview-роль видит новый публичный сайт.
8. Несколько существующих записей открываются в админке.
9. Несколько старых `/uploads/*` возвращают файлы.
10. Новый тестовый upload сохраняется и открывается после обновления страницы.
11. `/companies` и legacy alias `/businesses` работают.
12. `/robots.txt`, `/sitemap.xml`, `/_nuxt/*` и favicon доступны.

Сравните контрольные количества предпринимателей, компаний, интервью, reels и статей до и после деплоя. Не выключайте сплэш при расхождении данных, ошибках авторизации или недоступных uploads.

## Официальное открытие сайта

Ререлиз под сплэшем и публичное открытие являются двумя разными операциями. Сначала завершите production smoke-check через admin preview.

Для открытия сайта:

1. Подтвердите решение с владельцем.
2. Откройте настройки админки.
3. Установите `SPLASH_ENABLED=false` и сохраните настройки.
4. Проверьте главную и ключевые маршруты в гостевом браузере.
5. Проверьте ответы без admin cookie через внешний HTTP-клиент.
6. Убедитесь, что reverse proxy или CDN не возвращает закэшированный сплэш.
7. Наблюдайте health, логи, API и uploads в согласованный период.

Выключение сплэша не требует пересборки или перезапуска контейнера, потому что Nitro middleware читает значение из PostgreSQL.

## Rollback

### App-only rollback

Используйте app-only rollback, если новый код не запускается, но PostgreSQL и uploads не повреждены:

1. Оставьте или верните `SPLASH_ENABLED=true`.
2. Зафиксируйте ошибку и логи нового контейнера.
3. Повторно разверните записанный предыдущий commit через существующий Stack.
4. Не удаляйте и не пересоздавайте volumes.
5. Дождитесь healthy-состояния старого app-контейнера.
6. Повторите auth, admin, content и uploads smoke-check.

Не запускайте старое приложение поверх несовместимой новой schema без проверки. На текущем ререлизе schema-дельты между ветками нет, но это условие нужно перепроверять перед каждым следующим release.

### Восстановление данных

Восстанавливайте PostgreSQL или uploads только при подтверждённой порче данных. Restore перезаписывает production-состояние и требует отдельного согласования владельца, остановки записи и точной инструкции для фактической инфраструктуры.

До появления проверенного restore-runbook сохраняйте исходные volumes и backup-файлы неизменными. Не выполняйте импровизированное восстановление во время app-only сбоя.

## Release log

Добавляйте запись для каждого production-деплоя:

```md
## YYYY-MM-DD HH:MM — краткое название

- Оператор:
- Stack:
- Предыдущий commit:
- Новый commit:
- Database volume:
- Uploads volume:
- Database backup:
- Uploads backup:
- Prisma status до деплоя:
- Prisma migrations во время деплоя:
- Результат health-check:
- Результат smoke-check:
- Состояние сплэша после деплоя:
- Rollback потребовался: да/нет
- Примечания:
```

Release log можно хранить в отдельном закрытом операционном журнале, если пути к бэкапам или инфраструктурные имена не должны попадать в публичный репозиторий.

## Известные блокеры первого ререлиза

- Рабочие бэкапы PostgreSQL и uploads ещё не настроены.
- Точные имена production volumes неизвестны.
- Git-ветка, подключённая к Stack `whoistheboss`, ещё не зафиксирована в документе.
- Текущий compose ещё должен получить Nuxt runtime bridging для session и public site config.
- Splash middleware ещё должен проверять роль авторизованного пользователя для preview-bypass.
- Нужно согласовать, получает preview только `ADMIN` или также `EDITOR`.
- Нужно проверить расхождение: владелец видит public preview после legacy admin login, но Git-код `main` не содержит такого bypass.

Production merge разрешается только после закрытия этих пунктов или явного документированного принятия риска владельцем.
