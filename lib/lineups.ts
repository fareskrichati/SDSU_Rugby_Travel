import type { Player } from './data';
import type { PacketDetails } from './packet-template';
export type LineupKey='rosterOne'|'rosterTwo'|'reserves';
export type LineupPlayer=PacketDetails['rosterOne'][number];
export const lineupKeys:LineupKey[]=['rosterOne','rosterTwo','reserves'];
export function normalizeRoster(roster:Player[]):Player[]{return roster.map((p,i)=>({...p,id:p.id||`legacy-player-${i}`}));}
export function resolvePlayer(row:LineupPlayer,roster:Player[]):LineupPlayer{
 const player=row.playerId?roster.find(p=>p.id===row.playerId):roster.find(p=>p.name.trim().toLowerCase()===row.name.trim().toLowerCase());
 return player?{...row,name:player.name,playerId:player.id}:row;
}
export function linkedLineups(p:PacketDetails,roster:Player[]):PacketDetails{return {...p,...Object.fromEntries(lineupKeys.map(k=>[k,p[k].map(r=>resolvePlayer(r,roster))]))};}
export function nextNumber(rows:LineupPlayer[]):string{let n=1;const used=new Set(rows.map(r=>r.number));while(used.has(String(n)))n++;return String(n);}
export function assignPlayer(p:PacketDetails,roster:Player[],key:LineupKey,id:string):PacketDetails{
 const player=roster.find(r=>r.id===id);if(!player)return p;
 const linked=linkedLineups(p,roster);if(lineupKeys.some(k=>linked[k].some(r=>r.playerId===id)))return linked;
 return {...linked,[key]:[...linked[key],{playerId:id,name:player.name,number:nextNumber(linked[key])}]};
}
export function movePlayer(p:PacketDetails,from:LineupKey,index:number,to:LineupKey):PacketDetails{
 if(from===to||!p[from][index])return p;const player=p[from][index];
 return {...p,[from]:p[from].filter((_,i)=>i!==index),[to]:[...p[to],{...player,number:nextNumber(p[to])}]};
}
export function swapPlayer(p:PacketDetails,roster:Player[],key:LineupKey,index:number,id:string):PacketDetails{
 const player=roster.find(r=>r.id===id);if(!player||!p[key][index])return p;
 const result=linkedLineups(p,roster);const original=result[key][index];
 if(original.playerId===id)return result;
 for(const k of lineupKeys){const i=result[k].findIndex(r=>r.playerId===id);if(i!==-1){result[k]=result[k].map((r,j)=>j===i?{...original,number:r.number}:r);break;}}
 result[key]=result[key].map((r,i)=>i===index?{playerId:id,name:player.name,number:r.number}:r);return result;
}
export function reorderPlayer(p:PacketDetails,key:LineupKey,index:number,delta:number):PacketDetails{
 const target=index+delta;if(target<0||target>=p[key].length)return p;const rows=[...p[key]];
 const old=rows[index];rows[index]={...rows[target],number:old.number};rows[target]={...old,number:rows[target].number};return {...p,[key]:rows};
}
