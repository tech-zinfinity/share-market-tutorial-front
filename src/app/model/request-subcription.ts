import { Document } from './../service/fire.service';

export interface RequestSubcription extends Document{
    
    username?:string,
    userId?:string,
    userEmail?:string,
    courseId?:string,
    courseTitle?:string,
    courseCost?:number,
    paymentRef?:string,
    createdOn?:any,
    updatedOn?:any,
    status?:string
}
