import type { Trip } from './data';
export function matchLocation(trip:Trip):'home'|'away'{return trip.packet?.homeEnabled?'home':trip.matchType||'away';}
export function matchLabel(trip:Trip):string{return matchLocation(trip)==='home'?'Home match':'Away match';}
export function todayInSanDiego(now=new Date()):string{const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const part=(type:string)=>parts.find(p=>p.type===type)?.value;return `${part('year')}-${part('month')}-${part('day')}`;}
export function hasMatchDate(trip:Trip):boolean{return /^\d{4}-\d{2}-\d{2}$/.test(trip.date)&&Number.isFinite(Date.parse(trip.date+'T12:00:00'));}
export function sortMatches(trips:Trip[]):Trip[]{return [...trips].sort((a,b)=>hasMatchDate(a)?hasMatchDate(b)?a.date.localeCompare(b.date): -1:hasMatchDate(b)?1:0);}
export function featuredMatch(trips:Trip[],today:string):{trip:Trip|undefined;label:string}{const sorted=sortMatches(trips);const next=sorted.find(t=>hasMatchDate(t)&&t.date>=today);if(next)return {trip:next,label:next.date===today?'Match day':'Next match'};const undated=sorted.find(t=>!hasMatchDate(t));if(undated)return {trip:undated,label:'Date to be confirmed'};return {trip:sorted.at(-1),label:'Most recent match'};}
export function upcomingMatches(trips:Trip[],today:string):Trip[]{return sortMatches(trips).filter(t=>!hasMatchDate(t)||t.date>=today);}
export function mapLinks(address:string){const query=encodeURIComponent(address.trim());return {google:`https://www.google.com/maps/search/?api=1&query=${query}`,apple:`https://maps.apple.com/?q=${query}`};}

export function daysUntilMatch(date:string,today:string):number|null{
 const calendarDay=(value:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return NaN;const timestamp=Date.parse(value+'T00:00:00Z');return Number.isFinite(timestamp)&&new Date(timestamp).toISOString().slice(0,10)===value?timestamp:NaN;};
 const days=(calendarDay(date)-calendarDay(today))/86400000;return Number.isFinite(days)&&days>=0?days:null;
}
