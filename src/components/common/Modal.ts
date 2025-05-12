import { Component } from "../base/Component";
import { IEvents } from "../base/events";
// класс который наследуется и от которого будут наследоваться
export class Modal <T> extends Component<T> {
    protected modal: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
      super(container);
      this.events = events;
      const closeButtonElement = this.container.querySelector(".popup__close");
      closeButtonElement.addEventListener("click", this.close.bind(this));
      // Клик вне содержимого окна:
      // “Закрой окно, только если клик был не по вложенным элементам, а по самому контейнеру.”
      this.container.addEventListener("mousedown", (evt) => {
        if (evt.target === evt.currentTarget) {
          this.close();
        }
      });
      this.handleEscUp = this.handleEscUp.bind(this);
    }
  
    open() {
      this.container.classList.add("popup_is-opened");
      // устанавливаем обработчик наклавишу esc
      document.addEventListener("keyup", this.handleEscUp);
        }
  
    close() {
      this.container.classList.remove("popup_is-opened");
            // cнимаем обработчик с наклавиши esc чтобы не было утечек памяти

      document.removeEventListener("keyup", this.handleEscUp);
    }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
      };
  }
  