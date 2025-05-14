import './blocks/index.css';
import { CardData } from './components/CardsData';
import { UserData } from './components/UserData';
import { EventEmitter, IEvents } from './components/base/events';
import { ICard, ICardsData, IUser, IUserData, TCardInfo, TUserPublicInfo } from './types';

import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';

import { API_URL,settings } from './utils/constants';
import { Card } from './components/Card';
import { testCards,testUser } from './utils/temperConstants';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from './utils/utils';
import { UserInfo } from './components/UserInfo';
import { ModalWithConfirm } from './components/ModalWithConfirm';
import { ModalWithForm } from './components/ModalWithForm';
import { ModalWithImage } from './components/ModalWithImage';

// Api — низкоуровневый HTTP-клиент.
const baseApi = new Api(API_URL,settings)
// AppApi — высокоуровневый адаптер под конкретное приложение (getCards, getUser и т.д.).
const api = new AppApi(baseApi)
const events = new EventEmitter();


const cardsData =new CardData(events);
const userData = new UserData(events)
const profile = document.querySelector('.profile') as HTMLElement

const userView = new UserInfo(profile,events)
// экземпляры мод окон
const imageModal = new ModalWithImage(document.querySelector('.popup_type_image'), events);
const userModal = new ModalWithForm(document.querySelector('.popup_type_edit'), events);
const cardModal = new ModalWithForm(document.querySelector('.popup_type_new-card'), events);
const avatarModal = new ModalWithForm(document.querySelector('.popup_type_edit-avatar'), events);
const confirmModal = new ModalWithConfirm(document.querySelector('.popup_type_remove-card'), events);

const cardTemplate = document.querySelector('.card-template') as  HTMLTemplateElement


const cardsContainer = new CardsContainer(document.querySelector('.places__list'))

// events.onAll((event)=>{
//   console.log(event.eventName,event.data)
// })
// первая отрисовка всех элементов
Promise.all([api.getUser(),api.getCards(),])
  .then(([userInfo,cardsInfo])=>{
    // Когда промисы завершаются, данные передаются в синхронную часть кода через .then().
    userData.setUserInfo(userInfo) //сохраняем данные
    // console.log(userData.getUserInfo());
    cardsData.cards = cardsInfo;
    // генерируем событие когда все данные сохранены в моделях:
    events.emit('initialData:loaded');//сообщаем: всё готово
    
  })
  .catch((err)=>{
    console.log('Что-то пошло не так', err);
  })


// const testSection = document.querySelector('.places') as HTMLElement;

   function renderAll(){
    
      const cardsArray = cardsData.cards.map((card)=>{
        const cardInstant = new Card(cloneTemplate(cardTemplate),events);
        return cardInstant.render(card, userData.id)
      })
      // грузим карточки и данные профиля
      cardsContainer.render({catalog: cardsArray})
      userView.render(userData.getUserInfo())
      // Ты слушаешь это событие и отрисовываешь пользователя и карточки.
    
    // 📌 Только после этого появляется кнопка, на которую можно нажать.
    }

//  подписываемся на событие => выводим данные на страницу,когда данные загружены
events.on('initialData:loaded',()=>{
  renderAll()
})


 //аватар


events.on('avatar:open',()=>{
  avatarModal.open();
  avatarModal.render({valid:true})
  console.log(userData.getUserInfo())
})

events.on(`edit-avatar:submit`,(data:{avatar:string})=>{
    
    api.setUserAvatar(data)
      .then((updateAvatar)=>{
        avatarModal.close()
        userData.setUserInfo(updateAvatar) // обвовляем данные  в моделе пользователя
      //  и генерируем событие this.events.emit('user:changed');
      })
      .catch((err)=>{
        console.log('ошибка в обновлении аватара')
      })
})





events.on('newCard:open',()=>{
  
  
  cardModal.render({valid:true})
  cardModal.open();
  //   создаем событие о валидации формы
events.emit(`new-place:validation`,cardModal)
})
// Только после initialData:loaded пользователь вообще может нажать на кнопку и вызвать userEdit:open. Поэтому данные уже есть в памяти и готовы к использованию.
// т е событие open может сгенерировать эелемент который уже загружен и менно поэтому userModal.inputValues  получает загруженные с сервера данные
events.on('userEdit:open',()=>{
  const {name, about} = userData.getUserInfo()
  
  const inputValues = {userName:name, userDescription:about};

  userModal.render({inputValues,valid:true})
 
  userModal.open()
})


events.on(`edit-profile:submit`,(inputValues:{userName:string,userDescription:string})=>{
  const {userName, userDescription} = inputValues
  const user = {
    name: userName,
    about:userDescription
  }
  api.setUserInfo(user)
    .then((data)=>{
    
      userData.setUserInfo(data) 
      // вставляем в модель обновленные данные пользователя 
      // и эмитируем событие ('user:changed')
    })
    .catch((err)=>{
      console.log('ошибка при изменении данных пользователя',err)
    })
})

events.on('user:changed',()=>{
  userView.render(userData.getUserInfo())
  userModal.close()
})



// Потому что порядок такой:

// Сначала грузим данные с сервера.

// Потом сохраняем их в Data.

// Потом пользователь нажимает кнопку.

// Потом событие userEdit:open срабатывает.

// Потом берём сохранённые данные из userData.getUserInfo() и подставляем в форму.

events.on('card:select',(data: {card: Card})=>{
  const {card} = data
  // по данным наоходим ссылку на объект карточки
  const {name, link} = cardsData.getCard(card._id);
  const image = {name, link};
  imageModal.render({image})
  imageModal.open()
})

// добавление карточки
events.on('new-place:submit',(data:TCardInfo)=>{
    api.addCard(data)
      .then((res)=>{
        cardsData.addCard(res) // кладем карточку в  модель данных
        //  и events.emit('cards:changed') - сообщаем, что массив карточек изменился
        
      })
      .catch((err)=>{
        console.log('Ошибка в добавлении карточки',err )
      })
})

// удаление карточки
events.on('card:delete',(data:{card:Card})=>{
   console.log(data.card._id)
   confirmModal.open()
   events.on('remove-card:submit',()=>{ //  подтв удал карточки
     api.removeCard(data.card._id) // удаляем карточку
      .then(()=>{
        cardsData.deleteCard(data.card._id) // удаляем картоку из модели данных
        // и events.emit('cards:changed') - сообщаем, что массив карточек изменился
        confirmModal.close()
      })
      .catch((err)=>{
        console.log('Ошибка в удалении карточки',err )
      })
  })
  
   
})











// лайк

events.on('card:like',(data:{card:Card,isLike:boolean})=>{
  // console.log(data.card._id)
  api.changeLikeCardStatus(data.card._id,data.isLike)
    .then((updataCard)=>{
     
      // renderAll()
     // заменяем карточку в массиве
     cardsData.updateCard(updataCard)  // обновляем карточку в  модель данных
     events.emit('cards:changed'); // говорим, что надо всё перерисовать
    })
    .catch((err)=>{
      console.error('Ошибка при лайке карточки:', err);
    })
})






// перерисовка на основании изменения данных
events.on('cards:changed',()=>{
  
  renderAll() 
  cardModal.close()
  // все перерисовываем на основании изменения массива карточек
  // удаление. добавление карточки
})





// события ввода и валидации
events.on(`edit-profile:input`,(data: { field: 'userName' | 'userDescription'; value: string })=>{
  const user: { field: keyof TUserPublicInfo; value: string } = { field: 'name', value: '' };

	if (data.field === 'userName') {
		user.field = 'name';
		user.value = data.value;
	} 
  if (data.field === 'userDescription') { //
		user.field = 'about';
		user.value = data.value;
	}
 
  const error:{ field: string; value: string; validInformation: string } = {
    field:data.field,
    value: data.value,
    validInformation:userData.checkField(user) // выявленная ошибка
  }

  userModal.error = error

    
})

events.on(`edit-avatar:input` ,(data:{field:'avatar', value:string})=>{
  const error:{ field: string; value: string; validInformation: string } = {
    field:data.field,
    value: data.value,
    validInformation:userData.checkField(data) // выявленная ошибка
  }

  avatarModal.error = error

})


events.on(`new-place:input`,(data:{field:'name' | 'link', value:string})=>{
  const error:{ field: string; value: string; validInformation: string } = {
    field:data.field,
    value: data.value,
    validInformation:cardsData.checkField(data) // выявленная ошибка
  }
console.log(data)
  cardModal.error = error


})


events.on(`new-place:validation`,(data: Record<keyof TCardInfo, string>)=>{
  
  cardModal.valid = cardsData.checkValidation(data)
 
})

events.on(`edit-avatar:validation`,(data: {avatar:string})=>{
    // console.log(userData.checkAvatarValidation(data))
    avatarModal.valid = userData.checkAvatarValidation(data as Record<keyof TUserPublicInfo, string>)
  console.log(userData.checkAvatarValidation(data as Record<keyof TUserPublicInfo, string>))
})

events.on(`edit-profile:validation`,(data: Record<string, string>)=>{
  const {userName,userDescription} = data;
  const user = {
    name: userName,
    about:userDescription,
    avatar:'null'
  }
  userModal.valid = userData.checkUserValidation(user)
 
 
})

// кнопки
//  подьверждение удаление

// - `edit-profile:validation` - событие, сообщающее о необходимости валидации формы профиля
// - `edit-avatar:validation` - событие, сообщающее о необходимости валидации формы аватара пользователя
// - `new-place:validation` - событие, сообщающее о необходимости валидации формы создания новой карточки