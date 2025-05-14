import { Modal } from './common/Modal';
import { IEvents } from './base/events';

interface IModalConfirm {
    valid: boolean;
    submitCallback: Function;
}
export class ModalWithConfirm extends Modal <IModalConfirm> {
	protected submitButton: HTMLButtonElement;
	protected _form: HTMLFormElement;
	protected formName: string;
	protected _handleSubmit: Function;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._form = this.container.querySelector('.popup__form');
		this.submitButton = this._form.querySelector('.popup__button');
		this.formName = this._form.getAttribute('name'); // для генерации событий
		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			// вызываем событие сабмит с кокретным именем формы тк форм у нас много
			this.events.emit(`${this.formName}:submit`, {
				// передаем обработчик формы
				submitCallback: this.handleSubmit,  // обработчик удаляющий каждую кокретную карточку
			});
		});
	}
// возможная деактивация кнопки
	set valid(isValid: boolean) {
		this.submitButton.classList.toggle('popup__button_disabled', !isValid);
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}

	set handleSubmit(submitFunction: Function) {
		// передаем обработчик удаление карточки
		this._handleSubmit = submitFunction;
	}
}
