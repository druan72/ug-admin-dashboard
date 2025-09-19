import { useState } from 'react'

export default function TasksPanel({tasks, onAdd, onToggle}){
  const [title,setTitle] = useState('')
  const [due,setDue] = useState('')
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <input className="border p-2 rounded flex-1" placeholder="New task" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded" type="datetime-local" value={due} onChange={e=>setDue(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>{onAdd({title, due_at: due || null}); setTitle(''); setDue('')}}>Add</button>
      </div>
      <div className="space-y-2">
        {tasks.map(t=> (
          <label key={t.id} className="flex items-center gap-2 p-2 border rounded-xl">
            <input type="checkbox" checked={t.status==='done'} onChange={()=>onToggle(t)} />
            <div className="flex-1">
              <div className="text-sm">{t.title}</div>
              {t.due_at && <div className="text-xs opacity-70">Due {new Date(t.due_at).toLocaleString()}</div>}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
