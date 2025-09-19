export default function Timeline({items}){
  return (
    <div className="space-y-2">
      {items.map(it=> (
        <div key={it.id} className="p-3 border rounded-xl">
          <div className="text-xs opacity-70">{new Date(it.at).toLocaleString()} • {it.type}</div>
          {it.meta && <div className="text-sm">{it.meta}</div>}
        </div>
      ))}
    </div>
  )
}
