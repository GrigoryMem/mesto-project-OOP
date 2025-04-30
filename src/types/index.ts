// по данным Создаем интерфейсы

export interface ICard  {
    likes:IUser[],
    _id:string,
    name: string,
    link: string,
    owner: IUser,
    createdAt:string
}

export interface IUser{
    name: string,
    about: string,
    avatar: string,
    _id: string,
    cohort: string
}
// интерфейс для коллекции карточек
export interface ICardsData {
    cards: ICard[],
    preview:string | null; // указатель на ту карточку которую мы хотим
    // просмотреть(сохр Id карточки) чтобып онимать какую карточку смотреть в модалке
}

// Создаем отдельные типы данных:(на каких данных базируется работа компонентов) сравния элемент страницы на макете
//  для  карточки (мо создания карточки)
export type ICardInfo = Pick<ICard, 'name' | 'link'>;
// для данных профиля(главная страница - где отобр 3 св-ва)
export type IIserPublicInfo = Pick<IUser, 'name' | 'about' | 'avatar'>;
// для профиля - МО изменить данные профиля
export type IUserBaseInfo = Pick<IUser,'name' | 'about'>;
// для формы для аватарки
export type IUserAvatar = Pick<IUser,'avatar'>;
