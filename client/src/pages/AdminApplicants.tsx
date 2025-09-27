import { useEffect, useState } from 'react'

type Applicant = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  createdAt?: string
  idDocumentPath?: string
  diplomaPath?: string
  profileImagePath?: string
}

export default function AdminApplicants() {
  const [items, setItems] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/applicants')
      const data = await res.json()
      setItems(data)
      setLoading(false)
    })()
  }, [])

  const filtered = items.filter(a => {
    const s = `${a.firstName||''} ${a.lastName||''} ${a.email||''} ${a.phone||''}`.toLowerCase()
    return s.includes(query.toLowerCase())
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Applicants</h2>
      <div className="mb-4 flex items-center gap-2">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search" className="border rounded px-3 py-2" />
        <span className="text-sm opacity-70">{filtered.length} results</span>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Submitted</th>
                <th className="p-2 border">Documents</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a._id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-950">
                  <td className="p-2 border">{a.firstName} {a.lastName}</td>
                  <td className="p-2 border">{a.email}</td>
                  <td className="p-2 border">{a.phone}</td>
                  <td className="p-2 border text-sm">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</td>
                  <td className="p-2 border text-sm flex gap-2">
                    {a.idDocumentPath && <a className="text-blue-600" href={`/uploads/${a.idDocumentPath}`} target="_blank" rel="noreferrer">ID</a>}
                    {a.diplomaPath && <a className="text-blue-600" href={`/uploads/${a.diplomaPath}`} target="_blank" rel="noreferrer">Diploma</a>}
                    {a.profileImagePath && <a className="text-blue-600" href={`/uploads/${a.profileImagePath}`} target="_blank" rel="noreferrer">Photo</a>}
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


