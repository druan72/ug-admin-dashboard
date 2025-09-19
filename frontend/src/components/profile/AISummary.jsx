export default function AISummary({student}){
  const lines = []
  if(student.ai_questions_count >= 5) lines.push('Engages heavily with AI assistant; likely needs deeper essay guidance.')
  if(student.uploaded_docs_count > 0) lines.push('Has begun document uploads; on-track for application milestones.')
  if(student.status === 'Exploring') lines.push('Still exploring options — consider a curated shortlist and intro call.')
  if(lines.length===0) lines.push('No strong signals yet; schedule a check-in.')
  return (
    <div className="p-3 border rounded-xl bg-gray-50 text-sm">{lines.join(' ')}</div>
  )
}
