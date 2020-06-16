import { Document } from './../service/fire.service';

export interface User extends Document{
    username?:string,
    password?:string,
    roles?:string[],
    permissions?:string[],
    active?:boolean,
    loggedIn?:boolean,
    email?:string,
    name?:string,
    confirmpassword?:string,
    subscriptions?:string[],
    myCourses?:MyCourse[],
}

export interface MyCourse {
    courseId?:string,
    status?:string,
    title?:string,
    message?:string
}
