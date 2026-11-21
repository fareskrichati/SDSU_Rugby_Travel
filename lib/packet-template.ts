import { z } from 'zod';
const line=z.string().max(10000);
const person=z.object({number:line,name:line});
const gear=z.object({item:line,assigned:line,checked:z.boolean()});
export const detailsSchema=z.object({
 title:line, teamOne:line, teamTwo:line,
 headings:z.object({information:line,attire:line,transport:line,personalGear:line,teamGear:line,times:line,roster:line,reserves:line,additional:line}),
 attire:line, carEnabled:z.boolean(),busEnabled:z.boolean(),planeEnabled:z.boolean(),homeEnabled:z.boolean(),
 cars:z.array(z.object({car:line,driver:line,passengers:z.array(line).max(20)})).max(100),
 bus:line,plane:line,home:line,
 personalGear:z.array(gear).max(100),teamGear:z.array(gear).max(100),
 times:z.array(z.object({time:line,everyone:line,teamOne:line,teamTwo:line})).max(200),
 rosterOne:z.array(person).max(100),rosterTwo:z.array(person).max(100),reserves:z.array(person).max(100),footnotes:line
});
export type PacketDetails=z.infer<typeof detailsSchema>;
export function createDetails():PacketDetails{return {
 title:'Rugby Travel Packet',teamOne:'Eagles',teamTwo:'Jaguars',
 headings:{information:'Information',attire:'Travel Attire',transport:'Transportation',personalGear:'Individual Gear Checklist',teamGear:'Team Travel Equipment',times:'Game Day / Travel Times (Subject to Change)',roster:'Roster',reserves:'Injury Reserve',additional:'Additional Travel Details'},
 attire:'Wear SDSU Rugby polo with black SDSU gym shorts and shoes for travel.\nWear the same attire on the way home.',
 carEnabled:false,busEnabled:false,planeEnabled:false,homeEnabled:false,cars:[],bus:'',plane:'',home:'',
 personalGear:['Travel Polo','Practice Shirt','Rugby Shorts (Black SDSU 8x8)','Cleats','Mouthpiece','Water Bottle','Jacket or Hoodie','Extra Clothes','Rugby Travel Shorts','Rugby Tank Top'].map(item=>({item,assigned:'',checked:false})),
 teamGear:['Ball Bags','4 Tackle Shields','Medical Bag','Water Bottles','SDSU Canopy','Practice Pinnies','Smaller Canopy','Speaker','Veo Camera','Jersey Bag'].map(item=>({item,assigned:'',checked:false})),
 times:[],rosterOne:[],rosterTwo:[],reserves:[],footnotes:''
};}
export function getDetails(value:unknown):PacketDetails{const result=detailsSchema.safeParse(value);return result.success?result.data:createDetails();}
