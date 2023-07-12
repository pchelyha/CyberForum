//типы данных для новости и пользователя
type post={title:string, text:string,id:number,author?:string}
type user={id?:number,login:string, name:string, email:string, password:string,secondName:string,birthday?:string}
export {
    post,
    user
}