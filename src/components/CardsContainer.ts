import { Component } from "./base/Component";


interface ICardsContainer {
    catalog: HTMLElement[];
}
//  передаем объект в кот будет св-во каталог где будет хр-ся массив карточек
export class CardsContainer extends Component<ICardsContainer> {
    protected _catalog: HTMLElement;
  

    constructor(protected container: HTMLElement) {
        super(container)// ????
    }
// получение массива с карточками
    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

   
}

// container — это HTML-элемент, в который будем вставлять карточки.

// set catalog(...) — это "специальный метод",
//  который автоматически вызывается, если ты присваиваешь this.catalog = [...]. Он обновляет HTML, вставляя карточки.

// render(data) — принимает объект, например 
// { catalog: [элементы] } и копирует все свойства из него в сам объект, то есть делает this.catalog = [...].
