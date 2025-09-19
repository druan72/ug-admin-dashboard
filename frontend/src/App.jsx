import { useEffect, useState } from 'react'
import TopNav from './components/layout/TopNav'
import StatsCards from './components/dashboard/StatsCards'
import FiltersBar from './components/dashboard/FiltersBar'
import StudentTable from './components/dashboard/StudentTable'
import StudentProfile from './components/profile/StudentProfile'
import { fetchInsights, fetchStudents } from './api'

export default function App(){
  const [insights, setInsights] = useState(null)
  const [rows, setRows] = useState([])
  const [filters, setFilters] = useState({})
  const [openId, setOpenId] = useState(null)

  async function load(){
    setInsights(await fetchInsights())
    setRows(await fetchStudents(filters))
  }
  useEffect(()=>{ load() },[JSON.stringify(filters)])

  return (
    <div className="max-w-6xl mx-auto">
      <TopNav/>
      {!openId ? (
        <div className="p-4 space-y-4">
          <StatsCards insights={insights}/>
          <FiltersBar onChange={setFilters}/>
          <div className="flex gap-2 text-xs">
            <button className="underline" onClick={()=>setFilters({not_contacted_days:7})}>Students not contacted in 7 days</button>
            <button className="underline" onClick={()=>setFilters({high_intent:true})}>High intent</button>
            <button className="underline" onClick={()=>setFilters({status:'Applying'})}>Needs essay help (Applying)</button>
          </div>
          <StudentTable rows={rows} onOpen={setOpenId}/>
        </div>
      ) : (
        <div className="p-4"><StudentProfile id={openId} onBack={()=>setOpenId(null)} /></div>
      )}
    </div>
  )
}
