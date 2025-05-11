import { ICard, IUser } from '../types';
import { cloneTemplate } from '../utils/utils';
import { CardData } from './CardsData';
import { Component } from './base/Component';
import { IEvents } from './base/events';
// задача класса - сообщать нам о том,что польщователь что-то сделал
export class Card  extends Component<ICard>{
	
	protected events: IEvents;
	protected likeButton: HTMLButtonElement;
	protected likesCount: HTMLElement;
	protected deleteButton: HTMLButtonElement;
	protected cardImage: HTMLDivElement;
	protected cardTitle: HTMLElement;
	protected cardId: string;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container) // передаем в конструктор родителя контейнер

		this.events = events;
		
		//  данные  разметки необходимые для работыс карточкой
		this.likeButton = this.container.querySelector('.card__like-button');
		this.likesCount = this.container.querySelector('.card__like-count');
		this.deleteButton = this.container.querySelector('.card__delete-button');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardTitle = this.container.querySelector('.card__title');
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

	// переопределить родительский метод и вызвать метод родителя
//  заполнение всех  атрибуты эелементов разметки карточки
// передаем данные

// если могут передаваться один перегрузка метода:
render(data?: Partial<ICard>): HTMLElement  // render() — просто передаётся частичный объект карточки
render(cardData: Partial<ICard>, userId: string) : HTMLElement // передаётся карточка и id пользователя, чтобы, например, знать, кто лайкал и чей это элемент
// далее  оба варианта нужно отражотать  в методе:

	render(cardData: Partial<ICard> | undefined, userId?: string) {

		if(!cardData) return this.container; // если пустая карточка возвращаем разметку
		const {likes, owner, ...otherCardData} = cardData;
		if(userId){ // если пришел userId 
			if(likes) this.likes = {likes, userId}; //сеттер где свои где чужие лайки
			// если владелец есть задействуем сеттер owner - установка кнопки корзины
			if(owner) this.owner = {owner, userId}
		}
		// может принимать объект с люб данными которые поменялись
		// cardData: Partial<ICard> - это такой объект который будет частично содержаться в ICard
		// userId: string - id польз-ля, от лица кот нужно нарисовать карточки
		// userId поиск лайка -свой не свой
		//  деструктуризация - достаем объект лайков, объект владельца
		//  otherCardData - все остальные св-ва 
		
		// если лайки есть задействуем сеттер likes(абс люб присваивание вызывает сеттер) - установка владельца
		// "Если в карточке есть лайки, передай их в сеттер, чтобы правильно отобразить:
		//  закрашено сердечко или нет и сколько лайков всего."
	
		// позволяер добавить данные в объект из совпадающих полей:
		// ...otherCardData: name, link, id А уже оставшиеся простые поля (name, link, _id) добавляют так:
	
		// чтобы не прописывать каждыйв отдельности напр(this.name = otherCardData.name
		//  те если мы св-во name передали, значение перезаписывается и т.д.)
	
		// сеттеры this.likes this.owner отв за визуальные изменения:
		// Поэтому:
// Извлекают likes и owner через деструктуризацию:
// Отдельно вызывают сеттеры:

// Если бы ты просто сделал:


// Object.assign(this, cardData);
// То:

// this.likes = ... не сработал бы через сеттер, а просто заменил бы поле likes,

// ты пропустил бы логику отрисовки интерфейса, заложенную в этих сеттерах (а это вся магия визуальных изменений!).
// Object.assign(this,otherCardData) 
// return this.container
// Вместо строк ввыше используем метод родителя Component:
			return	super.render(otherCardData)
	}
	
	set likes ({likes, userId}:{likes:IUser[], userId:string}){
		// Определяет, лайкнул ли карточку текущий пользователь:
		// userId: string - id польз-ля, от лица кот нужно нарисовать карточки
		// userId поиск лайка -свой не свой
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
		// сохраняем id карточки
		this.cardId = id; 
	}
	get _id() {
		return this.cardId; 
		// возв id карточки
	}

	deleteCard() {
		this.container.remove(); //удаление элемента разметки
		// Объект this.element (ссылка на DOM-элемент) всё ещё находится в памяти внутри объекта класса Card.
		this.container = null; // а сам экземпляр класса остается памяти
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
	
}
