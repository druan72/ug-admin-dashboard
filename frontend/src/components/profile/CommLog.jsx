import { useState } from 'react'

export default function CommLog({comms, onLog, onFollowup}){
  const [channel,setChannel] = useState('email')
  const [subject,setSubject] = useState('')
  const [body,setBody] = useState('')
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <select className="border p-2 rounded" value={channel} onChange={e=>setChannel(e.target.value)}>
          <option>email</option>
          <option>sms</option>
          <option>call</option>
        </select>
        <input className="border p-2 rounded flex-1" placeholder="Subject (optional)" value={subject} onChange={e=>setSubject(e.target.value)} />
        <input className="border p-2 rounded flex-[2]" placeholder="Body / summary" value={body} onChange={e=>setBody(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>onLog({channel, subject, body})}>Log</button>
        <button className="px-3 py-2 rounded border" onClick={onFollowup}>Trigger follow-up (mock)</button>
      </div>
      <div className="space-y-2">
        {comms.map(c=> (
          <div key={c.id} className="p-2 border rounded-xl">
            <div className="text-xs opacity-70">{new Date(c.at).toLocaleString()} • {c.channel} • {c.direction}</div>
            <div className="text-sm font-medium">{c.subject}</div>
            <div className="text-sm">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
