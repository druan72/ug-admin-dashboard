const order = ["Exploring","Shortlisting","Applying","Submitted"]
export default function ProgressBar({status}){
  const idx = order.indexOf(status)
  return (
    <div className="flex items-center gap-2">
      {order.map((s,i)=> (
        <div key={s} className={`flex-1 h-2 rounded ${i<=idx? 'bg-black':'bg-gray-200'}`}></div>
      ))}
    </div>
  )
}
