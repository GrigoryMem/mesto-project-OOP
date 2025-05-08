import { ICard, IUser } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
// задача класса - сообщать нам о том,что польщователь что-то сделал
export class Card {
	protected element: HTMLElement;
	protected events: IEvents;
	protected likeButton: HTMLButtonElement;
	protected likesCount: HTMLElement;
	protected deleteButton: HTMLButtonElement;
	protected cardImage: HTMLDivElement;
	protected cardTitle: HTMLElement;
	protected cardId: string;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		// создает разметку карточки и отв за все то что находится внутри карточки
		this.element = cloneTemplate(template);
		//  данные  разметки необходимые для работыс карточкой
		this.likeButton = this.element.querySelector('.card__like-button');
		this.likesCount = this.element.querySelector('.card__like-count');
		this.deleteButton = this.element.querySelector('.card__delete-button');
		this.cardImage = this.element.querySelector('.card__image');
		this.cardTitle = this.element.querySelector('.card__title');
// обработчики
		this.cardImage.addEventListener('click', () =>
			//  сообщаем о событии, которое произошло:
			// { card: this }  передается экземпляр этого класса	
			this.events.emit('card:select', { card: this })
		);

		this.deleteButton.addEventListener('click', () =>
			this.events.emit('card:delete', { card: this })
		);

		this.likeButton.addEventListener('click', () =>
			this.events.emit('card:like', { card: this, isLike: this.isLiked() })
		);
	}
//  установлен лайк или нет
//  можно "спросить  у данных" если  наш лайк или нет
//  можно вычеслять исходя из того закрашено сердечко или нет(есть ли наличие лайка)
	isLiked() { 
		return this.likeButton.classList.contains('card__like-button_is-active');
	}
//  заполнение всех  атрибуты эелементов разметки карточки
// передаем данные
	setData(cardData: Partial<ICard>, userId: string) {
		// cardData: Partial<ICard> - это такой объект который будет частично содержаться в ICard
		// userId: string - id польз-ля, от лица кот нужно нарисовать карточки
		// userId поиск лайка -свой не свой
		this.cardId = cardData._id; // сохраняем id карточки

	
		
		
	}
	
	set likes ({likes, userId}:{likes:IUser[], userId:string}){
		// установка лайка в нужное состояние
					// В  массиве лайков карточки   - лайкнута пользователем  с id userId:?
		const cardIsLiked = likes.some((like) => like._id === userId);
		// / Передаём вторым аргументом false, и будет работать как remove()
		// Опционально вторым аргументом можно передать boolean-значение:
		//  метод будет работать как add(), если передать true, и как remove(),
		//  если передать false.
		this.likeButton.classList.toggle(
			'card__like-button_is-active',
			cardIsLiked // если да то добав модификатор 'card__like-button_is-active'
		);
		// количество лайков сохр в наш счетчик
		this.likesCount.textContent = String(likes.length);
	}
	// передаем  владельца и id пользователя с которым надо сравнивать
	set owner({owner, userId}:{owner:IUser, userId:string}){
		// отображание или удаление корзины
		// владелец карточки  это пользователь которого мы сюда передали?
		if (owner._id !== userId) {
			
			this.deleteButton.style.display = 'none';
		} else {
			this.deleteButton.style.display = 'inherit';
		}
	}
	set link(link:string){
		this.cardImage.style.backgroundImage = `url(${link})`;
	}

	set name(name:string){
		this.cardTitle.textContent = name;
	}

	set _id(id:string){
		// сохраняем id
		this.cardId = id;
	}
	get _id() {
		return this.cardId; 
		// возв id карточки
	}

	deleteCard() {
		this.element.remove(); //удаление элемента разметки
		// Объект this.element (ссылка на DOM-элемент) всё ещё находится в памяти внутри объекта класса Card.
		this.element = null; // а сам экземпляр класса остается памяти
		//  после удаления карточкаисчезнет а все данные этого
		//  конструктора будут храниться дальше в памяти поэтому очищаемп память

		// Эта строка обнуляет ссылку на DOM-элемент. То есть ты явно говоришь JavaScript-движку:

// «Этот элемент мне больше не нужен, можешь его освободить, если надо».
// → даже если карточка уже удалена из DOM, ссылка остаётся
// → память не освобождается
// → утечка памяти (memory leak)
// И теперь сборщик мусора видит, что объект 
// больше не нужен → и может его безопасно очистить из оперативной памяти.
	}
	render() {
		return this.element;
	}
}
