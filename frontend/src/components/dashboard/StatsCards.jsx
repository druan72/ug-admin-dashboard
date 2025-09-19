export default function StatsCards({insights}){
  const by = insights?.by_status || {}
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      <Card label="Total" value={insights?.total ?? 0}/>
      <Card label="Active (7d)" value={insights?.active_7d ?? 0}/>
      <Card label="Exploring" value={by.Exploring ?? 0}/>
      <Card label="Applying" value={by.Applying ?? 0}/>
    </div>
  )
}
function Card({label, value}){
  return (
    <div className="p-4 rounded-2xl border shadow-sm">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
