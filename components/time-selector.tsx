'use client';

type Props = { value: string; label: string; onChange: (value: string) => void };
function parseTime(value: string) {
 const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
 if (!match) return null;
 let hour = Number(match[1]);
 const minute = Number(match[2] || 0);
 if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return null;
 const period = match[3]?.toUpperCase() || (hour >= 12 ? 'PM' : 'AM');
 hour = hour % 12 || 12;
 return { hour: String(hour), minute: String(minute).padStart(2, '0'), period };
}
export default function TimeSelector({ value, label, onChange }: Props) {
 const time = parseTime(value);
 function update(part: 'hour' | 'minute' | 'period', next: string) {
  const result = { hour: '12', minute: '00', period: 'AM', ...time, [part]: next };
  onChange(`${result.hour}:${result.minute} ${result.period}`);
 }
 return <div className="time-selector" role="group" aria-label={label}>
  {value && !time && <span className="existing-time">Current: {value}</span>}
  <div className="time-selector-controls">
   <select aria-label={`${label} hour`} value={time?.hour || ''} onChange={e => update('hour', e.target.value)}><option value="" disabled>Hour</option>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select>
   <span aria-hidden="true">:</span>
   <select aria-label={`${label} minute`} value={time?.minute || ''} onChange={e => update('minute', e.target.value)}><option value="" disabled>Min</option>{Array.from({length:60},(_,i)=>{const minute=String(i).padStart(2,'0');return <option key={minute} value={minute}>{minute}</option>})}</select>
   <select aria-label={`${label} AM or PM`} value={time?.period || ''} onChange={e => update('period', e.target.value)}><option value="" disabled>AM/PM</option><option>AM</option><option>PM</option></select>
  </div>
  {value && <button type="button" className="text-button" aria-label={`Clear ${label}`} onClick={()=>onChange('')}>Clear time</button>}
 </div>;
}
