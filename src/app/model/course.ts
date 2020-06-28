import { Topic } from './topic';
import { SubscriptionModel } from './subscription';
import { Document } from './../service/fire.service';
export interface Course extends Document{
    
    title?:string,
    dscp?:string,
    subscription?: SubscriptionModel,
    active?: boolean,
    topics?: Topic[],
    coverPhotoImg?:string,
    img?:string
}
