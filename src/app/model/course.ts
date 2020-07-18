import { User } from './user';
import { Topic } from './topic';
import { SubscriptionModel } from './subscription';
import { Document } from './../service/fire.service';
import * as firebase from 'firebase/app';

export interface Course extends Document{
    
    title?:string;
    dscp?:string;
    subscription?: SubscriptionModel;
    active?: boolean;
    topics?: Topic[];
    coverPhotoImg?:string;
    img?:string,
    publishDate?: any | Date;
    tags?:string[],
    tempTags?:string,
    trending?:true,
    tutor?:any,
    learnings?:string[],
    finalDuration?:number,
    temntutor?:User,
    advantages?:string[]
}
