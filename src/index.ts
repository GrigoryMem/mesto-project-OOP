import './blocks/index.css';
import { CardData } from './components/CardsData';
import { UserData } from './components/UserData';
import { EventEmitter, IEvents } from './components/base/events';
import { ICard, IUser } from './types';

import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';

import { API_URL,settings } from './utils/constants';
import { Card } from './components/Card';
import { testCards,testUser } from './utils/temperConstants';
import { CardsContainer } from './components/CardsContainer';
import { cloneTemplate } from './utils/utils';
import { UserInfo } from './components/UserInfo';

// Api — низкоуровневый HTTP-клиент.
const baseApi = new Api(API_URL,settings)
// AppApi — высокоуровневый адаптер под конкретное приложение (getCards, getUser и т.д.).
const api = new AppApi(baseApi)
const events = new EventEmitter();


const cardsData =new CardData(events);
const userData = new UserData(events)


const cardTemplate = document.querySelector('.card-template') as  HTMLTemplateElement


const cardsContainer = new CardsContainer(document.querySelector('.places__list'))
// const user = appApi.getUser()
//   .then((res)=>{
//     userData.setUserInfo(res)
//     console.log(userData)
//   })
//   .catch((err)=>{
//     console.log('Ошибка при загрузке карточек', err)
//   })


// const cards= appApi.getCards()
//     .then((res)=>{
//         cardsData.cards = res
//         console.log(cardsData)
//     })
//     .catch((err)=>{
//         console.log("Произошла ошибка", err)
//     });

// const placesList = document.querySelector('.places__list');
// тестирование событий:
events.onAll((event)=>{
  console.log(event.eventName,event.data)
})
// первая отрисовка всех элементов
Promise.all([api.getUser(),api.getCards(),])
  .then(([userInfo,cardsInfo])=>{
    // Когда промисы завершаются, данные передаются в синхронную часть кода через .then().
    userData.setUserInfo(userInfo)
    // console.log(userData.getUserInfo());
    cardsData.cards = cardsInfo;
    // генерируем событие когда все данные сохранены в моделях:
    events.emit('initialData:loaded');
    
  })
  .catch((err)=>{
    console.log('Что-то пошло не так', err);
  })


// const testSection = document.querySelector('.places') as HTMLElement;
const profile = document.querySelector('.profile') as HTMLElement

const userView = new UserInfo(profile,events)
    


// const card = new Card(cloneTemplate(cardTemplate),events);
// const card1 = new Card(cloneTemplate(cardTemplate),events);
// const cardArray = [];
// cardArray.push(card.render(testCards[2],testUser._id),card1.render(testCards[1],testUser._id),)

// cardsContainer.render({catalog:cardArray})


// const userInfo = new UserInfo(profile,events)





// userInfo.render(user)

// userInfo.render({about:"Helloworld"})
//  подписываемся на событие
events.on('initialData:loaded',()=>{
  const cardsArray = cardsData.cards.map((card)=>{
    const cardInstant = new Card(cloneTemplate(cardTemplate),events);
    return cardInstant.render(card, userData.id)
  })
  // грузим карточки и данные профиля
  cardsContainer.render({catalog: cardsArray})
  userView.render(userData.getUserInfo())
})