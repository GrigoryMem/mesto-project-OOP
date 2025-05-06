import './blocks/index.css';
import { CardData } from './components/CardsData';
import { UserData } from './components/UserData';
import { EventEmitter, IEvents } from './components/base/events';
import { ICard, IUser } from './types';

import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';

import { API_URL,settings } from './utils/constants';


// Api — низкоуровневый HTTP-клиент.

// AppApi — высокоуровневый адаптер под конкретное приложение (getCards, getUser и т.д.).
const events:IEvents = new EventEmitter();
const cardsData =new CardData(events);
const userData = new UserData(events)
const api = new Api(API_URL,settings)
const appApi = new AppApi(api)



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


Promise.all([appApi.getUser(),appApi.getCards(),])
  .then(([userInfo,cardsInfo])=>{
    userData.setUserInfo(userInfo)
    console.log(userData.getUserInfo());
    cardsData.cards = cardsInfo;
    console.log(cardsData.cards);
  
  })




    // Слой	Что делает	Пример из твоего кода
    // API (инфра)	Говорит с сервером	Api, AppApi
    // Model (домен)	Хранит и управляет данными	CardData, UserData
    // Presenter / Glue	Соединяет API и Model	getCards().then(res => ...)
    // View (UI)	Показывает данные	(у тебя пока нет — будет компонент)