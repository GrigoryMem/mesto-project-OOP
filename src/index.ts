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

// Api — низкоуровневый HTTP-клиент.
const baseApi = new Api(API_URL,settings)
// AppApi — высокоуровневый адаптер под конкретное приложение (getCards, getUser и т.д.).
const api = new AppApi(baseApi)
const events = new EventEmitter();


const cardsData =new CardData(events);
const userData = new UserData(events)


const cardTemplate = document.querySelector('.card-template') as  HTMLTemplateElement

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

Promise.all([api.getUser(),api.getCards(),])
  .then(([userInfo,cardsInfo])=>{
    userData.setUserInfo(userInfo)
    // console.log(userData.getUserInfo());
    cardsData.cards = cardsInfo;
    // console.log(cardsData.cards);

    // cardsData.cards.forEach((cardItem)=>{
    //   const template = document.querySelector('.card-template') as  HTMLTemplateElement
    //   const cardWrap = new Card(template,events)
    //   cardWrap.setData(cardItem,'')
      
    //   placesList.append(cardWrap.render())
    // })
    
  })
  .catch((err)=>{
    console.log('Что-то пошло не так', err);
  })


const testSection = document.querySelector('.places');


      const cardWrap = new Card(cardTemplate,events)
      cardWrap.setData(testCards[0],testUser._id)
      
      testSection.append(cardWrap.render())
  

    // Слой	Что делает	Пример из твоего кода
    // API (инфра)	Говорит с сервером	Api, AppApi
    // Model (домен)	Хранит и управляет данными	CardData, UserData
    // Presenter / Glue	Соединяет API и Model	getCards().then(res => ...)
    // View (UI)	Показывает данные	(у тебя пока нет — будет компонент)