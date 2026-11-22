import { hasSameOrigin } from '../../../lib/packet-security.mjs';
import { packetRepository } from '../../../lib/packet-store.mjs';
import { initial } from '../../../lib/data';
import { isSeason, normalizeSeasons } from '../../../lib/seasons';
import { detailsSchema } from '../../../lib/packet-template';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{const row=await packetRepository().read();return Response.json({data:normalizeSeasons(row?.data??initial),version:row?.version??0},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Could not load travel information. Please try again.'},{status:503});}}
export async function POST(req:Request){
 if(!hasSameOrigin(req))return Response.json({error:'Invalid request origin.'},{status:403});
 const secret=process.env.TRAVEL_EDIT_CODE;
 const code=req.headers.get('x-edit-code')||'';
 const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
 if(!secret)return Response.json({error:'Editing is not configured.'},{status:503});
 const a=await digest(code),b=await digest(secret);let difference=0;for(let i=0;i<a.length;i++)difference|=a[i]^b[i];
 if(difference)return Response.json({error:'That edit code is incorrect.'},{status:401});
 try{const body=await req.json() as any;if(body.verify)return Response.json({ok:true});
 if(!Number.isSafeInteger(body.version)||body.version<0)return Response.json({error:'Invalid packet version. Reload before editing.'},{status:400});
 let d=body.data;if(!d||!Array.isArray(d.trips)||!Array.isArray(d.roster)||typeof d.announcement!=='string'||d.trips.length>200||d.roster.length>300||JSON.stringify(d).length>400000)return Response.json({error:'Invalid packet data.'},{status:400});
 const fields=['id','year','opponent','city','date','kickoff','venue','address','departure','transport','hotel','meals','itinerary','packing','contact','notes'];
 if(d.trips.some((t:any)=>fields.some(f=>typeof t[f]!=='string')||!t.opponent.trim())||d.roster.some((p:any)=>['name','number','position','year'].some(f=>typeof p[f]!=='string')))return Response.json({error:'Check the trip and roster fields.'},{status:400});
 d=normalizeSeasons(d);if(d.trips.some((t:any)=>!isSeason(t.year))||d.roster.some((p:any)=>!isSeason(p.year)))return Response.json({error:'Use a fall/spring season such as 2026-2027.'},{status:400});
 if(d.trips.some((t:any)=>t.matchType!==undefined&&!['home','away'].includes(t.matchType)))return Response.json({error:'Choose Home or Away for the match location.'},{status:400});
 if(d.trips.some((t:any)=>t.packet!==undefined&&!detailsSchema.safeParse(t.packet).success))return Response.json({error:'Check the travel packet tables and fields.'},{status:400});
 if(d.roster.some((r:any)=>r.id!==undefined&&(typeof r.id!=='string'||r.id.length>200)))return Response.json({error:'Invalid roster player ID.'},{status:400});
 const playerIds=d.roster.map((r:any)=>r.id).filter(Boolean);if(new Set(playerIds).size!==playerIds.length)return Response.json({error:'Roster player IDs must be unique.'},{status:400});
 const version=await packetRepository().save(d,body.version);
 if(version===null)return Response.json({error:'Someone else saved changes. Reload before editing.'},{status:409});
 return Response.json({version});
 }catch{return Response.json({error:'Could not save. Your edits are still on this screen.'},{status:500});}
}
