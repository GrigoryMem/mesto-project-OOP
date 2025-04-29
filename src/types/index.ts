interface ICard  {
  likes:IUser[],
  _id:string,
  name: string,
  link: string,
  owner: IUser,
  createdAt:string
}




interface IUser{
  name: string,
  about: string,
  avatar: string,
  _id: string,
  cohort: string
}