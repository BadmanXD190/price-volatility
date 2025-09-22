"use client";
export default function Controls({
  items, states, value, onChange
}: {
  items: Record<string,string>, states: string[],
  value: { item_code:number; state:string; horizon:number },
  onChange: (v:{item_code:number; state:string; horizon:number})=>void
}) {
  return (
    <div className="row">
      <div>
        <label>Item</label>
        <select value={value.item_code} onChange={e=>onChange({...value, item_code: Number(e.target.value)})}>
          {Object.entries(items).map(([code,name])=>(
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>State</label>
        <select value={value.state} onChange={e=>onChange({...value, state: e.target.value})}>
          {states.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label>Forecast horizon</label>
        <select value={value.horizon} onChange={e=>onChange({...value, horizon: Number(e.target.value)})}>
          <option value={1}>Next day (1d)</option>
          <option value={7}>7 days ahead</option>
          <option value={30}>30 days ahead</option>
        </select>
      </div>
    </div>
  );
}
