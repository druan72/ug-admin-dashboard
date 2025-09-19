export default function StudentTable({rows, onOpen}){
  return (
    <div className="overflow-auto border rounded-2xl">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Country</Th>
            <Th>Status</Th>
            <Th>Last Active</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>onOpen(r.id)}>
              <Td>{r.name}</Td>
              <Td>{r.email}</Td>
              <Td>{r.country || '—'}</Td>
              <Td><span className="px-2 py-1 rounded-full bg-gray-100">{r.status}</span></Td>
              <Td>{r.last_active_at ? new Date(r.last_active_at).toLocaleString() : '—'}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function Th({children}){ return <th className="text-left p-3 font-medium">{children}</th> }
function Td({children}){ return <td className="p-3 border-t">{children}</td> }
