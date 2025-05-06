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
    cards: ICard[], // массив карточек
    preview:string | null; // указатель на ту карточку которую мы хотим(попап просмотра карточки)
    // просмотреть(сохр Id карточки) чтобып онимать какую карточку смотреть в модалке
    // null - вариант если мы не смотрим никакую карточку
    addCard(card:ICard): void;
    deleteCard(cardId:string,payload:Function | null):void;// payload доп функция
    updateCard(card:ICard,payload:Function | null):void;
    getCard(cardId:string): ICard;
    checkValidation(data: Record<keyof TCardInfo, string>):boolean;
}

export interface IUserData{
	getUserInfo(): TUserPublicInfo;
	setUserInfo(userData: IUser): void;
	checkUserValidation(data: Record<keyof TUserPublicInfo, string>): boolean;
}

// Создаем отдельные типы данных:(на каких данных базируется работа компонентов) сравния элемент страницы на макете
//  для  карточки (мо создания карточки)
export type TCardInfo = Pick<ICard, 'name' | 'link'>; // создали чтобы описать то, что может вводиться в форме
// для данных профиля(главная страница - где отобр 3 св-ва)
export type TUserPublicInfo = Pick<IUser, 'name' | 'about' | 'avatar'>; // публичная информацияо польз
// для профиля - МО изменить данные профиля
export type TUserBaseInfo = Pick<IUser,'name' | 'about'>;
// для формы для аватарки
export type TUserAvatar = Pick<IUser,'avatar'>;


// методы post запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// T это тип вовзращаемого объекта от сервера
export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
