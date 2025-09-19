import { useState } from 'react'

export default function NotesPanel({notes, onAdd, onDel}){
  const [val,setVal] = useState('')
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Add internal note" value={val} onChange={e=>setVal(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>{if(val.trim()){onAdd(val); setVal('')}}}>Add</button>
      </div>
      <div className="space-y-2">
        {notes.map(n=> (
          <div key={n.id} className="p-2 border rounded-xl flex items-start justify-between gap-3">
            <div>
              <div className="text-xs opacity-70">{new Date(n.at).toLocaleString()} • {n.author}</div>
              <div className="text-sm">{n.body}</div>
            </div>
            <button className="text-xs opacity-70 hover:opacity-100" onClick={()=>onDel(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
