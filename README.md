## English Platform

Полноценный локальный full-stack проект:
- frontend: Vite + React + TypeScript + React Router
- backend: Django + DRF + SQLite + media uploads
- public + admin контуры работают через API и общую БД

## 1) Установка зависимостей

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
pip install -r requirements.txt
```

## 2) Переменные окружения

### Frontend `.env`
Скопируйте `.env.example` в `.env`:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend `backend/.env`
Скопируйте `backend/.env.example` в `backend/.env`.

Dev credentials:
- `ADMIN_LOGIN=admin`
- `ADMIN_PASSWORD=password`

## 3) Миграции и сидинг

```bash
cd backend
python manage.py migrate
python manage.py seed_from_mock --reset
```

`seed_from_mock` берет исходные данные из `src/app/data/mockData.ts` и заполняет SQLite.

## 4) Запуск

### Backend
```bash
cd backend
python manage.py runserver 8000
```

### Frontend
```bash
npm run dev
```

## 5) Основные роуты

Public:
- `/`
- `/catalog`
- `/catalog/:section`
- `/catalog/:section/:subsection`
- `/material/:slug`
- `/skill-map`

Admin:
- `/admin/login`
- `/admin`
- `/admin/materials`
- `/admin/materials/new`
- `/admin/materials/:id/edit`
- `/admin/textbooks`
- `/admin/sections`
- `/admin/tags`
- `/admin/history`
- `/admin/uploads`

## 6) Файлы и storage

- SQLite: `backend/db.sqlite3`
- Uploaded files: `backend/media/`
- API поддерживает CRUD материалов, тегов, разделов, учебников, skill-map, changelog, uploads

## 7) CORS/CSRF

- CORS и cookie credentials включены через `django-cors-headers`
- CSRF trusted origins настраиваются через `CSRF_TRUSTED_ORIGINS` в backend `.env`

## 8) Публикация на GitHub Pages

Фронтенд автоматически деплоится на GitHub Pages через workflow:
- `.github/workflows/deploy-pages.yml`
- URL после первого успешного деплоя: `https://maxmoon228.github.io/English/`

Что нужно настроить в GitHub репозитории:
1. `Settings -> Pages -> Build and deployment -> Source = GitHub Actions`
2. `Settings -> Secrets and variables -> Actions -> New repository secret`
3. Добавить секрет `VITE_API_BASE_URL` со значением публичного backend API, например:
   - `https://your-backend-domain/api`

Важно:
- GitHub Pages публикует только статический фронтенд.
- Для полноценной работы admin/auth/upload нужен отдельно развернутый Django backend (Render/Railway/VPS и т.д.).

## 9) Публикация на Render

В репозитории добавлен `render.yaml` для деплоя backend + frontend + PostgreSQL.

### Как запустить

1. В Render выберите **New -> Blueprint** и укажите репозиторий `MaxMoon228/English`.
2. Render автоматически поднимет:
   - PostgreSQL: `english-db`
   - Django API: `english-backend`
   - Static frontend: `english-frontend`
3. После первого деплоя откройте Shell у backend-сервиса и выполните:
   ```bash
   python manage.py seed_from_mock --reset
   python manage.py createsuperuser
   ```

### Важно для frontend base path

- По умолчанию для GitHub Pages используется `VITE_PUBLIC_BASE=/English/`.
- В Render для `english-frontend` уже задан `VITE_PUBLIC_BASE=/`, поэтому роутинг работает на корневом домене Render.
  