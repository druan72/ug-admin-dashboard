const API = 'http://localhost:8000';

export async function fetchInsights(){ return (await fetch(`${API}/insights`)).json() }
export async function fetchStudents(params={}){
  const q = new URLSearchParams(params).toString();
  return (await fetch(`${API}/students?${q}`)).json()
}
export async function fetchStudent(id){ return (await fetch(`${API}/students/${id}`)).json() }
export async function patchStudent(id, body){ 
  return (await fetch(`${API}/students/${id}`, {
    method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  })).json() 
}
export async function addNote(id, body){ 
  return (await fetch(`${API}/students/${id}/notes`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  })).json() 
}
export async function delNote(noteId){ 
  return (await fetch(`${API}/notes/${noteId}`, {method:'DELETE'})).json() 
}
export async function logComm(id, body){ 
  return (await fetch(`${API}/students/${id}/comms`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  })).json() 
}
export async function triggerFollowup(id){ 
  return (await fetch(`${API}/students/${id}/trigger-followup`, {method:'POST'})).json() 
}
export async function addTask(id, body){ 
  return (await fetch(`${API}/students/${id}/tasks`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  })).json() 
}
export async function patchTask(taskId, body){ 
  return (await fetch(`${API}/tasks/${taskId}`, {
    method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  })).json() 
}
