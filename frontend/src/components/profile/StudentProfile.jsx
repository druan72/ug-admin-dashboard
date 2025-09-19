import { useEffect, useState } from 'react'
import { fetchStudent, patchStudent, addNote, delNote, logComm, triggerFollowup, addTask, patchTask } from '../../api'
import Timeline from './Timeline'
import NotesPanel from './NotesPanel'
import CommLog from './CommLog'
import TasksPanel from './TasksPanel'
import ProgressBar from './ProgressBar'
import AISummary from './AISummary'

export default function StudentProfile({id, onBack}){
  const [data,setData] = useState(null)
  const [status,setStatus] = useState('')

  async function load(){ setData(await fetchStudent(id)) }
  useEffect(()=>{ load() },[id])
  useEffect(()=>{ if(data) setStatus(data.student.status) },[data])

  if(!data) return <div className="p-4">Loading…</div>
  const s = data.student

  async function saveStatus(){ await patchStudent(id, {status}); await load() }

  return (
    <div className="space-y-4">
      <button className="text-sm underline" onClick={onBack}>← Back to directory</button>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">{s.name}</div>
          <div className="text-sm opacity-70">{s.email} • {s.phone || '—'} • {s.country || '—'} • Grade {s.grade || '—'}</div>
        </div>
        <div className="flex items-center gap-3">
          <select className="border p-2 rounded" value={status} onChange={e=>setStatus(e.target.value)}>
            {['Exploring','Shortlisting','Applying','Submitted'].map(x=> <option key={x}>{x}</option>)}
          </select>
          <button className="px-3 py-2 rounded bg-black text-white" onClick={saveStatus}>Save</button>
        </div>
      </div>
      <ProgressBar status={s.status} />
      <AISummary student={s} />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Section title="Interaction Timeline"><Timeline items={data.interactions}/></Section>
          <Section title="Communication Log">
            <CommLog
              comms={data.comms}
              onLog={async (payload)=>{ await logComm(id, payload); await load() }}
              onFollowup={async ()=>{ await triggerFollowup(id); await load() }}
            />
          </Section>
        </div>
        <div className="space-y-4">
          <Section title="Internal Notes">
            <NotesPanel
              notes={data.notes}
              onAdd={async (body)=>{ await addNote(id,{author:'Admin', body}); await load() }}
              onDel={async (noteId)=>{ await delNote(noteId); await load() }}
            />
          </Section>
          <Section title="Tasks / Reminders">
            <TasksPanel
              tasks={data.tasks}
              onAdd={async (t)=>{ await addTask(id, t); await load() }}
              onToggle={async (t)=>{ await patchTask(t.id, {status: t.status==='done'?'open':'done'}); await load() }}
            />
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({title, children}){
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{title}</div>
      {children}
    </div>
  )
}
