# SoundVault — Сервис для прослушивания музыки и обзора альбомов

## Описание проекта

SoundVault — полноценное веб-приложение для каталогизации музыкальных альбомов, написания рецензий и прослушивания музыки.

**Стек технологий:**
- **Frontend:** React 18, React Router v6, Vite
- **Backend:** Node.js, Express.js
- **База данных:** MongoDB (через Mongoose)
- **Аутентификация:** JWT + bcrypt

---

## Структура проекта

```
soundvault/
├── backend/
│   ├── config/
│   │   └── db.js              # Подключение к MongoDB
│   ├── models/
│   │   ├── User.js            # Модель пользователя
│   │   ├── Artist.js          # Модель исполнителя
│   │   └── Album.js           # Модель альбома (с треками и рецензиями)
│   ├── controllers/
│   │   ├── userController.js  # Логика авторизации и пользователей
│   │   ├── albumController.js # CRUD альбомов, рецензии, счётчики
│   │   └── artistController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── albumRoutes.js
│   │   └── artistRoutes.js
│   ├── middleware/
│   │   └── auth.js            # Проверка JWT токена
│   ├── server.js              # Точка входа сервера
│   ├── seed.js                # Заполнение БД начальными данными
│   └── .env                   # Переменные окружения
└── frontend/
    ├── public/
    │   ├── covers/            # Обложки альбомов (jpg/png)
    │   └── music/             # MP3 файлы треков (добавить самостоятельно)
    ├── src/
    │   ├── api.js             # Все запросы к бэкенду
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── PlayerContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── MusicPlayer.jsx
    │   │   ├── AlbumCard.jsx
    │   │   ├── StarRating.jsx
    │   │   ├── Footer.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Albums.jsx
    │   │   ├── AlbumDetail.jsx
    │   │   ├── Artists.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   └── NotFound.jsx
    │   └── layouts/
    │       └── MainLayout.jsx
    └── package.json
```

---

## API маршруты

### Пользователи
| Метод | Маршрут | Описание | Защита |
|-------|---------|----------|--------|
| POST | /api/users/register | Регистрация | — |
| POST | /api/users/login | Авторизация | — |
| GET | /api/users/me | Профиль с избранным | JWT |
| PUT | /api/users/favorites/:albumId | Добавить/убрать из избранного | JWT |

### Альбомы
| Метод | Маршрут | Описание | Защита |
|-------|---------|----------|--------|
| GET | /api/albums | Список альбомов (фильтр, поиск, сортировка) | — |
| GET | /api/albums/:id | Один альбом | — |
| POST | /api/albums | Создать альбом | JWT + Admin |
| PUT | /api/albums/:id | Обновить альбом | JWT + Admin |
| DELETE | /api/albums/:id | Удалить альбом | JWT + Admin |
| POST | /api/albums/:id/reviews | Добавить рецензию | JWT |
| DELETE | /api/albums/:id/reviews/:reviewId | Удалить рецензию | JWT |
| POST | /api/albums/:id/play | +1 к прослушиваниям альбома | — |
| POST | /api/albums/:id/tracks/:trackId/play | +1 к прослушиваниям трека | — |

### Исполнители
| Метод | Маршрут | Описание | Защита |
|-------|---------|----------|--------|
| GET | /api/artists | Список исполнителей | — |
| GET | /api/artists/:id | Один исполнитель | — |
| POST | /api/artists | Создать исполнителя | JWT + Admin |
| PUT | /api/artists/:id | Обновить | JWT + Admin |
| DELETE | /api/artists/:id | Удалить | JWT + Admin |

---

## Коды ошибок

| Код | Значение |
|-----|----------|
| 400 | Некорректные данные запроса |
| 401 | Пользователь не авторизован |
| 403 | Нет прав (требуется роль admin) |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |

---

## Критерии курсовой работы

| Критерий | Реализация |
|----------|-----------|
| Архитектура проекта | MVC — Models / Controllers / Routes / Middleware |
| Работа с MongoDB | Mongoose-схемы для User, Artist, Album |
| CRUD операции | Полный CRUD для альбомов и исполнителей |
| Система авторизации | JWT + bcrypt, защищённые маршруты |
| Интеграция с frontend | React SPA подключён через API (/api proxy) |
| Качество кода | Разбит на модули, понятные имена, комментарии |
