# NoteHub

Навчальний вебзастосунок для створення, пошуку, перегляду та видалення нотаток.

## Можливості

- Головна сторінка з описом застосунку.
- Список нотаток із пагінацією (12 нотаток на сторінку) та фільтром за тегом.
- Пошук нотаток за ключовим словом із затримкою (debounce) 500 мс.
- Створення нотатки на окремій сторінці `/notes/action/create` із чернеткою, яка зберігається в `localStorage`.
- Видалення нотатки.
- Перегляд нотатки: у модальному вікні (перехоплений маршрут) або на окремій сторінці.
- SEO-метадані та Open Graph для всіх основних сторінок.
- Шрифт Roboto, підключений глобально через `next/font/google`.

## Технології

| Інструмент                    | Призначення                                            |
| ----------------------------- | ------------------------------------------------------ |
| Next.js 15 (App Router)       | маршрутизація, SSR, метадані                           |
| React 19, TypeScript          | інтерфейс і типізація                                  |
| TanStack Query                | запити на клієнті, prefetch і гідратація               |
| Axios                         | HTTP-запити до NoteHub API                             |
| Zustand + `persist`           | чернетка нової нотатки з синхронізацією в localStorage |
| react-paginate                | пагінація                                              |
| use-debounce                  | відкладений пошук                                      |
| CSS Modules, modern-normalize | стилізація                                             |
| Prettier, ESLint              | форматування та лінтинг коду                           |

## Маршрути

| Маршрут                | Опис                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `/`                    | головна сторінка із загальною інформацією                           |
| `/notes/filter/all`    | усі нотатки (тег в API не передається)                              |
| `/notes/filter/{tag}`  | нотатки за тегом: `Todo`, `Work`, `Personal`, `Meeting`, `Shopping` |
| `/notes/action/create` | створення нотатки з автозбереженням чернетки                        |
| `/notes/[id]`          | повна сторінка нотатки (при прямому переході чи оновленні)          |
| `/notes/[id]` (з UI)   | перехоплений маршрут: нотатка відкривається в модальному вікні      |
| будь-який інший шлях   | сторінка `404 - Page not found`                                     |

## SEO

- `app/layout.tsx` експортує `metadata` (`title`, `description`, Open Graph) і `metadataBase`.
- `app/not-found.tsx` експортує `metadata` для сторінки, якої не існує.
- `app/notes/action/create/page.tsx` експортує `metadata` для сторінки створення нотатки.
- `app/notes/filter/[...slug]/page.tsx` і `app/notes/[id]/page.tsx` використовують асинхронну `generateMetadata`: у першій вказано обраний фільтр, у другій — заголовок і короткий опис нотатки.
- Для Open Graph скрізь використано зображення `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`.
- Базова адреса сайту береться зі змінної `NEXT_PUBLIC_SITE_URL`.

## Шрифт

Roboto підключено в `app/layout.tsx` через `next/font/google` (`weight`, `variable`, `display`, `subsets`). CSS-змінна `--font-roboto` додається до `<body>` і використовується в `app/globals.css`.

## Чернетка нотатки (Zustand)

Стор у `lib/store/noteStore.ts` містить:

- `draft` — `{ title, content, tag }`, початковий стан `initialDraft = { title: "", content: "", tag: "Todo" }`;
- `setDraft(note)` — оновлює вказані поля чернетки;
- `clearDraft()` — повертає чернетку до `initialDraft`.

Стор обгорнутий у middleware `persist` (ключ `notehub-draft` у `localStorage`), тому чернетка переживає перезавантаження сторінки.

`components/NoteForm/NoteForm.tsx` — це стандартна HTML-форма з `action`. Значення полів беруться зі стору, а `onChange` одразу викликає `setDraft`.

- Після успішного створення нотатки чернетка очищається (`clearDraft`), і відбувається `router.back()`.
- Кнопка **Cancel** лише повертає на попередній маршрут (`router.back()`), чернетка зберігається.

## SSR і CSR

Сторінки `/notes/filter/[...slug]`, `/notes/[id]` та перехоплений маршрут поєднують обидва підходи:

1. **Сервер.** Серверний компонент (`page.tsx`) створює `QueryClient`, завантажує дані через `fetchQuery` / `prefetchQuery` і передає кеш клієнту через `HydrationBoundary`.
2. **Клієнт.** Клієнтські компоненти (`Notes.client.tsx`, `NoteDetails.client.tsx`, `NotePreview.client.tsx`) отримують готові дані з кешу через `useQuery`. `Notes.client.tsx` також керує пошуком і пагінацією, а `NoteList` — видаленням.

Ключі запитів на сервері й клієнті мають збігатися: `["notes", page, search, tag]` для списку та `["note", id]` для деталей.

## Структура проєкту

```
├── app/
│   ├── layout.tsx                  # глобальний layout: шрифт, metadata, Header, Footer, TanStackProvider, слот modal
│   ├── not-found.tsx               # сторінка 404 + metadata
│   ├── @modal/                     # паралельний слот для модальних вікон
│   │   ├── default.tsx
│   │   └── (.)notes/[id]/          # перехоплений маршрут: NotePreview у Modal
│   ├── page.tsx                    # головна сторінка (/)
│   └── notes/
│       ├── action/create/page.tsx  # сторінка створення нотатки (CreateNote) + metadata
│       ├── filter/
│       │   ├── layout.tsx          # sidebar + область нотаток
│       │   ├── @sidebar/           # SidebarNotes (паралельний маршрут)
│       │   └── [...slug]/          # page.tsx (generateMetadata, SSR) + Notes.client.tsx (CSR)
│       └── [id]/                   # повна сторінка нотатки (generateMetadata, SSR + CSR)
├── components/                     # кожен компонент у власній папці (.tsx + .module.css)
├── lib/
│   ├── constants.ts                # перелік тегів
│   ├── api.ts                      # єдина точка імпорту API-функцій
│   ├── api/
│   │   ├── api.ts                  # axios-інстанс
│   │   └── notes.ts                # fetchNotes, fetchNoteById, createNote, deleteNote
│   └── store/
│       └── noteStore.ts            # Zustand-стор із чернеткою нотатки
└── types/
    └── note.ts                     # Note, NewNote, NoteTag, FetchNotesParams, FetchNotesResponse
```

## Запуск локально

1. Встановіть Node.js (версія LTS).
2. Встановіть залежності:

   ```bash
   npm install
   ```

3. Створіть файл `.env.local` на основі `.env.example` і вкажіть свій токен NoteHub:

   ```
   NEXT_PUBLIC_NOTEHUB_TOKEN=ваш_токен
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Запустіть сервер розробки та відкрийте http://localhost:3000:

   ```bash
   npm run dev
   ```

## Скрипти

| Команда          | Дія                              |
| ---------------- | -------------------------------- |
| `npm run dev`    | сервер розробки                  |
| `npm run build`  | production-збірка                |
| `npm run start`  | запуск production-збірки         |
| `npm run lint`   | перевірка коду через ESLint      |
| `npm run format` | форматування коду через Prettier |

## Змінні оточення

| Змінна                      | Опис                                                                  |
| --------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_NOTEHUB_TOKEN` | токен доступу до NoteHub API                                          |
| `NEXT_PUBLIC_SITE_URL`      | публічна адреса сайту для `metadataBase`, canonical та Open Graph url |

Назва `NEXT_PUBLIC_NOTEHUB_TOKEN` починається з `NEXT_PUBLIC_`, бо так вимагає умова завдання: така змінна доступна і на сервері, і в браузері. Це означає, що токен потрапляє в клієнтський код, тому використовуйте для навчального проєкту лише навчальний токен.

Якщо `NEXT_PUBLIC_SITE_URL` не задано, використовується запасне значення `https://notehub.vercel.app`.

## Деплой на Vercel

1. Запуште репозиторій на GitHub.
2. Імпортуйте його у Vercel.
3. У Project Settings → Environment Variables додайте `NEXT_PUBLIC_NOTEHUB_TOKEN` та `NEXT_PUBLIC_SITE_URL` (адреса вашого деплою, наприклад `https://your-app.vercel.app`).
4. Зробіть redeploy, щоб змінні підхопились.
