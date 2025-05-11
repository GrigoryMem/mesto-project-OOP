import { TUserPublicInfo } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class UserInfo extends Component<TUserPublicInfo> {
    protected container: HTMLElement;
    protected userNameElement: HTMLElement;
    protected userAboutElement: HTMLElement;
    protected userAvatarElement: HTMLDivElement;
    protected userEditButton: HTMLButtonElement;
    protected userAddButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        // 1. находим все элементы разметки за который отвечает данный компонент
        //  и сохр их в защищенные поля класса
        this.userNameElement = this.container.querySelector('.profile__title');
        this.userAboutElement = this.container.querySelector('.profile__description');
        
        //  если есть элементы с кот будет взаимодействовать
        //  пользователь, устанавливаем слушатели
        this.userAvatarElement = this.container.querySelector('.profile__image');
        this.userEditButton = this.container.querySelector('.profile__edit-button');
        this.userAddButton = this.container.querySelector('.profile__add-button');
        // в качестве обработчика инициируем события
        this.userEditButton.addEventListener('click', () => this.events.emit('userEdit:open'))
        this.userAddButton.addEventListener('click', () => this.events.emit('newCard:open'))
        this.userAvatarElement.addEventListener('click', () => this.events.emit('avatar:open'))
    }
// сеттеры для передачи данных в объект:
    set name(name: string) {
        this.userNameElement.textContent = name;
    }

    set about(about: string) {
        this.userAboutElement.textContent = about;
    }

    set avatar(avatar: string) {
        this.userAvatarElement.style.backgroundImage = `url(${avatar})`;
    }

}