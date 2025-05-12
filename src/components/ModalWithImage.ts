import { Modal } from "./common/Modal";
import { IEvents } from "./base/events";

interface IModalWithImage {
    image: {
        name: string;
        link: string;
    }
}
export  class ModalWithImage extends Modal<IModalWithImage> {

    private imageElement: HTMLImageElement;
    private imageCaption: HTMLElement;

    constructor (container: HTMLElement, events: IEvents) {
        super(container, events)
        this.imageElement = this.container.querySelector(".popup__image");
        this.imageCaption = this.container.querySelector(".popup__caption");    
    }

    set image ({name, link}: {name: string, link: string}) {
        this.imageElement.src = link;
        this.imageElement.alt = `Изображение ${name}`;
        this.imageCaption.textContent = name;
        super.open();
    }
}

