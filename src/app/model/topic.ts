import { SafeHtml } from '@angular/platform-browser';

export interface Topic {
    id?:string
    title?:string,
    dscp?:string,
    videolink?:VideoEntry[],
    active?: boolean,
    createOn?:any

}
export interface VideoEntry{
    id?:string
    embedLink?: string,
    paid?: boolean,
    active?: boolean,
    video?:SafeHtml
}