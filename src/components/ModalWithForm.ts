import { Modal } from './common/Modal';
import { IEvents } from './base/events';

interface IModalForm {
	valid: boolean;
	inputValues: Record<string, string>;
	error: Record<string, string>;
}

// valid — форма валидна (true/false)

// inputValues — объект, в котором ключи — это имена полей (email, name...), а значения — то, что ввёл пользователь

// error — объект, где ключи — имена полей, а значения — текст ошибки

export class ModalWithForm extends Modal <IModalForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	protected _form: HTMLFormElement;
	protected errors: Record<string, HTMLElement>;
	protected formName: string;
	protected submitButton: HTMLButtonElement;

    constructor (container: HTMLElement, events: IEvents) {
        super(container, events)
		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.popup__input');
		this._form = this.container.querySelector('.popup__form');
		this.formName = this._form.getAttribute('name');
		this.submitButton = this._form.querySelector('.popup__button');
		this.errors = {}; // объект для хр-я всех ошибок
		// Создаём пустой объект, в который позже добавим спаны с ошибками
		this.inputs.forEach((input) => {
			// привязываем ошибки к именам полей inputов(спан)
			this.errors[input.name] = this._form.querySelector(`#${input.id}-error`);
		});
		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			// берем название формы чтобы сгенерировать название события:
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
			// this.getInputValues() - передаем данные кот хр-ся в полях формы
		});
		//  для валидации??
		this._form.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement; // достаем из события поле ввода
			// В каком именно поле ввода сработал input:
			const field = target.name; // имя пооле ввода
			const value = target.value; // то что забил польз-ль
			// генерируем событие : навзание формы + input  т.е. проверяем что поль-ль забил в поля
			this.events.emit(`${this.formName}:input`, { field, value });
			// Это нужно, чтобы валидация могла сработать "на лету", в другом месте кода.
			// Мое изменение  - при печатании генерировать событие валидации и передавать значения
			this.events.emit(`${this.formName}:validation`,  this.getInputValues());
		});
	}

	protected getInputValues() {  //позволяет собрать все значения из всех полей ввода
		const valuesObject: Record<string, string> = {}; // название поля ввода и значение кот в нем разместить
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	

	set inputValues(data: Record<string, string>) { // заполнение полей ввода данными // название поля ввода и значение кот в нем разместить
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}
// для ошибок Это удобно, например, если ты открываешь форму редактирования и хочешь подставить старые значения.
	set error(data: { field: string; value: string; validInformation: string }) {
		// data поле/значение/ошибка
		if (data.validInformation) {
			//  если есть ошибка(текст ошибки) то показ сообщение об ошибке
			this.showInputError(data.field, data.validInformation);
		} else {
			this.hideInputError(data.field);
		}
	}

	protected showInputError(field: string, errorMessage: string) {
		this._form[field].classList.add('popup__input_type_error'); //????
		this.errors[field].textContent = errorMessage;
		this.errors[field].classList.add('popup__error_visible');
	}

	protected hideInputError(field: string) {
		this._form[field].classList.remove('popup__input_type_error'); //????	
		this.errors[field].classList.remove('popup__error_visible');
		this.errors[field].textContent = '';
	}
// управление валидностью самой формы  - изменение статуса кнопки
	set valid(isValid: boolean) {
		// console.log({isValid})
		this.submitButton.classList.toggle('popup__button_disabled', !isValid); // деактивация кнопки
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}

	close() {
		super.close();
		this._form.reset(); // очитска формы
		this.inputs.forEach((element) => {
			this.hideInputError(element.name); // скрываем старые ошибки
		});

	}
}
