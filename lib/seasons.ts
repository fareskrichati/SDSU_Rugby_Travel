import type { Packet } from './data';
export const defaultSeason='2026-2027';
export function isSeason(value:string):boolean{const match=/^(\d{4})-(\d{4})$/.exec(value);return !!match&&Number(match[2])===Number(match[1])+1;}
export function parseSeasonInput(value:string):string|null{
 const cleaned=value.trim().replace(/[–—/]/g,'-').replace(/\s+/g,'');
 if(/^\d{4}$/.test(cleaned)){const start=Number(cleaned);return start>=1900&&start<9999?`${start}-${start+1}`:null;}
 return isSeason(cleaned)?cleaned:null;
}
export function seasonLabel(value:string):string{return value.replace('-', '–');}
function legacySeason(value:string,date=''):string{
 const span=value.trim().replace(/[–—/]/g,'-').replace(/\s+/g,'');if(isSeason(span))return span;
 if(!/^\d{4}$/.test(value))return value;
 const match=/^(\d{4})-(\d{2})-\d{2}$/.exec(date);
 const end=match?Number(match[1])+(Number(match[2])>=7?1:0):Number(value);
 return `${end-1}-${end}`;
}
// Read older calendar-year packets as fall/spring seasons without changing their records.
export function normalizeSeasons(data:Packet):Packet{
 const mapping=new Map<string,Set<string>>();
 const trips=data.trips.map(trip=>{const year=legacySeason(trip.year,trip.date);const seasons=mapping.get(trip.year)||new Set<string>();seasons.add(year);mapping.set(trip.year,seasons);return {...trip,year};});
 const roster=data.roster.map(player=>{const seasons=mapping.get(player.year);return {...player,year:seasons?.size===1?[...seasons][0]:legacySeason(player.year)};});
 return {...data,trips,roster};
}
