import { useEffect, useState } from 'react'

type Student = { _id?: string, firstName: string, lastName: string, email: string, registrationNumber: string }

export default function Students() {
  const [items, setItems] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Student>({ firstName:'', lastName:'', email:'', registrationNumber:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})

  async function load() {
    const r = await fetch('/api/students'); setItems(await r.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  function validate(s: Student) {
    const e: Record<string,string> = {}
    if (!s.firstName) e.firstName = 'Required'
    if (!s.lastName) e.lastName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) e.email = 'Valid email required'
    if (!s.registrationNumber) e.registrationNumber = 'Required'
    return e
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form); setErrors(v); if (Object.keys(v).length) return
    const res = await fetch('/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    if (res.ok) { setForm({ firstName:'', lastName:'', email:'', registrationNumber:'' }); load() }
  }

  async function remove(id?: string) {
    if (!id) return
    await fetch(`/api/students/${id}`, { method:'DELETE' })
    load()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Students</h2>
      <form onSubmit={create} className="grid md:grid-cols-4 gap-3 mb-6">
        <div>
          <input placeholder="First Name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} className={`w-full border rounded px-3 py-2 ${errors.firstName?'border-red-500':'border-gray-300'}`} />
          {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <input placeholder="Last Name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} className={`w-full border rounded px-3 py-2 ${errors.lastName?'border-red-500':'border-gray-300'}`} />
          {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
        </div>
        <div>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className={`w-full border rounded px-3 py-2 ${errors.email?'border-red-500':'border-gray-300'}`} />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <input placeholder="Reg No" value={form.registrationNumber} onChange={e=>setForm({...form, registrationNumber:e.target.value})} className={`w-full border rounded px-3 py-2 ${errors.registrationNumber?'border-red-500':'border-gray-300'}`} />
          {errors.registrationNumber && <p className="text-xs text-red-600">{errors.registrationNumber}</p>}
        </div>
        <div className="md:col-span-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Add Student</button>
        </div>
      </form>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Reg No</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s._id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-950">
                  <td className="p-2 border">{s.registrationNumber}</td>
                  <td className="p-2 border">{s.firstName} {s.lastName}</td>
                  <td className="p-2 border">{s.email}</td>
                  <td className="p-2 border">
                    <button onClick={()=>remove(s._id)} className="px-2 py-1 text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


