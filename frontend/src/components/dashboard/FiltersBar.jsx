import { useState } from 'react'

export default function FiltersBar({onChange}){
  const [q,setQ] = useState('')
  const [status,setStatus] = useState('')
  const [notDays,setNotDays] = useState('')
  const [hi,setHi] = useState(false)
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col">
        <label className="text-xs">Search</label>
        <input className="border p-2 rounded" placeholder="Name or email" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Status</label>
        <select className="border p-2 rounded" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Any</option>
          <option>Exploring</option>
          <option>Shortlisting</option>
          <option>Applying</option>
          <option>Submitted</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Not contacted in ≥ days</label>
        <input className="border p-2 rounded w-36" type="number" value={notDays} onChange={e=>setNotDays(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={hi} onChange={e=>setHi(e.target.checked)} /> High intent
      </label>
      <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>onChange({q, status, not_contacted_days: notDays || undefined, high_intent: hi})}>Apply</button>
    </div>
  )
}
