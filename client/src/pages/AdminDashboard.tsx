import { useEffect, useState } from 'react'

function useToken() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'))
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('admin_token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  return token
}

export default function AdminDashboard() {
  const token = useToken()
  const [tab, setTab] = useState<'ann'|'jobs'|'uni'>('ann')

  if (!token) {
    return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-sm text-gray-600">You must sign in to access admin features.</p>
        <a href="/login" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">Go to Login</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <div className="flex gap-2 border-b">
        <button onClick={()=>setTab('ann')} className={`px-4 py-2 ${tab==='ann'?'border-b-2 border-blue-600 text-blue-600':''}`}>Announcements</button>
        <button onClick={()=>setTab('jobs')} className={`px-4 py-2 ${tab==='jobs'?'border-b-2 border-blue-600 text-blue-600':''}`}>Jobs</button>
        <button onClick={()=>setTab('uni')} className={`px-4 py-2 ${tab==='uni'?'border-b-2 border-blue-600 text-blue-600':''}`}>Universities</button>
      </div>

      {tab==='ann' && <AnnouncementsPanel token={token} />}
      {tab==='jobs' && <JobsPanel token={token} />}
      {tab==='uni' && <UniversitiesPanel token={token} />}
    </div>
  )
}

function AnnouncementsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [kind, setKind] = useState('text')

  async function load() {
    const res = await fetch('/api/announcements/admin', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setItems(data)
  }
  useEffect(() => { void load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('title', title)
    fd.set('body', body)
    fd.set('featured', String(featured))
    fd.set('kind', kind)
    if (file) fd.set('media', file)
    const res = await fetch('/api/announcements', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
    if (res.ok) {
      setTitle(''); setBody(''); setFeatured(false); setFile(null); setKind('text')
      await load()
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this announcement?')) return
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) await load()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={create} className="rounded border p-4 bg-white">
        <h3 className="font-semibold mb-3">Create Announcement</h3>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2 mb-2" />
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Body (optional)" className="w-full border rounded px-3 py-2 mb-2" />
        <div className="flex gap-2 items-center mb-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} /> Featured</label>
          <select value={kind} onChange={e=>setKind(e.target.value)} className="border rounded px-2 py-1">
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="document">Document</option>
          </select>
        </div>
        <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} className="mb-3" />
        <button className="rounded bg-blue-600 text-white px-4 py-2">Publish</button>
      </form>

      <div className="rounded border p-4 bg-white">
        <h3 className="font-semibold mb-3">All Announcements</h3>
        <ul className="space-y-2">
          {items.map((it)=> (
            <li key={it._id} className="flex items-center justify-between gap-3 border rounded p-2">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-600">{it.kind} {it.featured ? '• featured' : ''}</div>
              </div>
              <div className="flex gap-2">
                <a className="text-blue-600 text-sm" href={it.mediaPath ? `/uploads/${it.mediaPath}` : '#'} target="_blank" rel="noreferrer">View</a>
                <button onClick={()=>remove(it._id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function JobsPanel({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('Remote')
  const [type, setType] = useState('Internship')
  const [category, setCategory] = useState('Software Engineering')

  async function load() {
    const res = await fetch('/api/jobs?page=1&limit=50')
    const data = await res.json()
    setItems(data.items)
  }
  useEffect(() => { void load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, company, location, type, category, tags: [] }),
    })
    if (res.ok) { setTitle(''); setCompany(''); await load() }
  }

  async function remove(id: string) {
    if (!confirm('Delete this job?')) return
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) await load()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={create} className="rounded border p-4 bg-white">
        <h3 className="font-semibold mb-3">Create Job</h3>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2 mb-2" />
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="w-full border rounded px-3 py-2 mb-2" />
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full border rounded px-3 py-2 mb-2" />
        <div className="flex gap-2 mb-2">
          <select value={type} onChange={e=>setType(e.target.value)} className="border rounded px-2 py-1">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="border rounded px-2 py-1 flex-1" />
        </div>
        <button className="rounded bg-blue-600 text-white px-4 py-2">Publish</button>
      </form>

      <div className="rounded border p-4 bg-white">
        <h3 className="font-semibold mb-3">All Jobs</h3>
        <ul className="space-y-2">
          {items.map((it)=> (
            <li key={it._id} className="flex items-center justify-between gap-3 border rounded p-2">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-600">{it.company} • {it.location}</div>
              </div>
              <div className="flex gap-2">
                <a className="text-blue-600 text-sm" href={`/apply?job=${it._id}`}>Open</a>
                <button onClick={()=>remove(it._id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function UniversitiesPanel({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [country, setCountry] = useState('Rwanda')
  const [funding, setFunding] = useState<'supported'|'self'>('supported')
  const [deadline, setDeadline] = useState('')
  const [website, setWebsite] = useState('')
  const [logo, setLogo] = useState<File | null>(null)

  async function load() {
    const res = await fetch('/api/universities/admin', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setItems(data)
  }
  useEffect(() => { void load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('name', name)
    fd.set('country', country)
    fd.set('funding', funding)
    if (deadline) fd.set('deadline', deadline)
    if (website) fd.set('website', website)
    if (logo) fd.set('logo', logo)
    const res = await fetch('/api/universities', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
    if (res.ok) { setName(''); setWebsite(''); setLogo(null); await load() }
  }

  async function remove(id: string) {
    if (!confirm('Delete this university?')) return
    const res = await fetch(`/api/universities/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) await load()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={create} className="rounded border p-4 bg-white">
        <h3 className="font-semibold mb-3">Create University</h3>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded px-3 py-2 mb-2" />
        <div className="flex gap-2 mb-2">
          <input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country" className="border rounded px-2 py-1 flex-1" />
          <select value={funding} onChange={e=>setFunding(e.target.value as any)} className="border rounded px-2 py-1">
            <option value="supported">Supported</option>
            <option value="self">Self</option>
          </select>
        </div>
        <input type="datetime-local" value={deadline} onChange={e=>setDeadline(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
        <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="Website" className="w-full border rounded px-3 py-2 mb-2" />
        <input type="file" onChange={e=>setLogo(e.target.files?.[0]||null)} className="mb-3" />
        <button className="rounded bg-blue-600 text-white px-4 py-2">Publish</button>
      </form>

      <div className="rounded border p-4 bg-white">
        <h3 className="font-semibold mb-3">All Universities</h3>
        <ul className="space-y-2">
          {items.map((it)=> (
            <li key={it._id} className="flex items-center justify-between gap-3 border rounded p-2">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-gray-600">{it.country} • {it.funding}</div>
              </div>
              <div className="flex gap-2">
                {it.logoPath && <a className="text-blue-600 text-sm" href={`/uploads/${it.logoPath}`} target="_blank" rel="noreferrer">Logo</a>}
                <button onClick={()=>remove(it._id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
