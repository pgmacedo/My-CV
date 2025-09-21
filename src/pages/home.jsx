import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase.from('notes').select('*')
      if (error) console.error(error)
      else setUsers(data)
    }
    loadUsers()
  }, []);
  return (
    <>
      <h1>My CV</h1>
      <iframe
        src="/CV.pdf"
        title="CV PDF - Paulo Macedo"
        style={{ width: '90vw', height: '90vh', border: '1px solid #ccc' }}
      />
      <ul>
        {users.map(u => <li key={u.id}>{u.title}</li>)}
      </ul>
    </>
  );
}
