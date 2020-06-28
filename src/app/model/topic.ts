import { SafeHtml } from '@angular/platform-browser';

export interface Topic {

    title?:string,
    dscp?:string,
    videolink?:VideoEntry[],
    active?: boolean,
    createOn?:any

}
export interface VideoEntry{
    embedLink?: string,
    paid?: boolean,
    active?: boolean,
    video?:SafeHtml
}