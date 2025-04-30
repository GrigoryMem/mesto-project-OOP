# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/blocks/index.css — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка

```
export interface ICard  {
    likes:IUser[],
    _id:string,
    name: string,
    link: string,
    owner: IUser,
    createdAt:string
}

```

Пользователь

```
export interface IUser{
    name: string,
    about: string,
    avatar: string,
    _id: string,
    cohort: string
}

```

Интерфейс для модели данных карточек

```
export interface ICardsData {
    cards: ICard[],
    preview:string | null;
}

```

Данные карточки, используемые в форме при создании новой краточки

```
export type ICardInfo = Pick<ICard, 'name' | 'link'>;

```

Основные данные пользователя,которые можно редактировать

```
export type IIserPublicInfo = Pick<IUser, 'name' | 'about' | 'avatar'>;

```

Данные пользователя в форме редактировани профиля

```
export type IUserBaseInfo = Pick<IUser,'name' | 'about'>;

```

Данные пользователяв форме редактировани профиля аватара

```
export type IUserAvatar = Pick<IUser,'avatar'>;

```
