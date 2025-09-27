import { useEffect, useMemo, useState } from 'react'

function useCounter(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      setValue(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, durationMs])
  return value
}

function useCountdown(targetIso?: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!targetIso) return { closed: false, days: 0, hours: 0, minutes: 0, seconds: 0 }
  const target = new Date(targetIso).getTime()
  const diff = Math.max(0, target - now)
  const closed = diff === 0
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { closed, days, hours, minutes, seconds }
}

function CountdownText({ target, prefix = 'Closes in: ' }: { target?: string, prefix?: string }) {
  if (!target) return <span className="text-blue-600">Ongoing</span>
  const c = useCountdown(target)
  const cls = c.closed ? 'text-red-600' : 'text-green-700'
  return (
    <span className={cls}>
      {c.closed ? 'Closed' : `${prefix}${c.days}d ${c.hours}h ${c.minutes}m ${c.seconds}s`}
    </span>
  )
}

// funding: 'supported' | 'self'
const rwUniversities = [
  { name: 'University of Rwanda', deadline: '2025-07-30T23:59:00Z', funding: 'supported' as const },
  { name: 'Rwanda Polytechnic', deadline: '2025-08-15T23:59:00Z', funding: 'supported' as const },
  { name: 'MKU Rwanda', deadline: undefined, funding: 'self' as const },
]

const intUniversities = [
  { name: 'Harvard University', deadline: '2026-01-01T05:00:00Z', funding: 'self' as const },
  { name: 'UCT', deadline: '2025-09-30T21:00:00Z', funding: 'supported' as const },
  { name: 'University of Toronto', deadline: '2025-12-15T05:00:00Z', funding: 'self' as const },
]

const scholarships = [
  { name: 'Mastercard Foundation Scholars', deadline: '2025-05-15T21:00:00Z', funding: 'supported' as const },
  { name: 'Chevening Scholarships', deadline: '2025-11-02T21:00:00Z', funding: 'supported' as const },
  { name: 'DAAD Scholarships', deadline: undefined, funding: 'supported' as const },
]

const jobListings = [
  { title: 'Secondary School Teacher - Mathematics', company: 'Ministry of Education', location: 'Kigali', category: 'education', deadline: '2025-06-30T21:00:00Z' },
  { title: 'Software Developer', company: 'RISA', location: 'Kigali', category: 'it', deadline: '2025-07-15T21:00:00Z' },
  { title: 'Project Manager', company: 'UNDP Rwanda', location: 'Kigali', category: 'admin', deadline: '2025-07-05T21:00:00Z' },
]

const testimonials = [
  { name: 'Aline', text: 'The team helped me secure a scholarship and prepare my application on time.' },
  { name: 'Eric', text: 'I landed my first job after their CV and interview coaching sessions.' },
  { name: 'Keza', text: 'Fast updates on university deadlines and clear guidance. Highly recommend.' },
]

export default function Home() {
  const [tab, setTab] = useState<'rw'|'int'|'sch'>('rw')
  const [q, setQ] = useState('')
  const [province, setProvince] = useState('')
  const [category, setCategory] = useState('')
  const [tIdx, setTIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [subMsg, setSubMsg] = useState('')
  const [funding, setFunding] = useState<'all'|'supported'|'self'>('all')
  const [open, setOpen] = useState<'all'|'open'|'closed'>('all')

  useEffect(() => {
    const id = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(id)
  }, [])

  const applicantsCount = useCounter(120)
  const studentsCount = useCounter(58)
  const partnersCount = useCounter(12)

  const uniBase = useMemo(() => tab==='rw'? rwUniversities : tab==='int' ? intUniversities : scholarships, [tab])
  const list = useMemo(() => {
    return uniBase.filter(u => {
      const fundOk = funding==='all' ? true : u.funding===funding
      if (!fundOk) return false
      if (open==='all') return true
      if (!u.deadline) return open==='open'
      const isClosed = new Date(u.deadline).getTime() <= Date.now()
      return open==='open' ? !isClosed : isClosed
    })
  }, [uniBase, funding, open])

  const jobs = useMemo(() => {
    return jobListings.filter(j => {
      const kw = `${j.title} ${j.company}`.toLowerCase().includes(q.toLowerCase())
      const locOk = !province || j.location===province
      const catOk = !category || j.category===category
      const isClosed = new Date(j.deadline).getTime() <= Date.now()
      const openOk = open==='all' ? true : (open==='open' ? !isClosed : isClosed)
      return kw && locOk && catOk && openOk
    })
  }, [q, province, category, open])

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSubMsg('Enter a valid email.'); return }
    setTimeout(() => { setSubMsg('Thanks! You are subscribed.'); setEmail('') }, 400)
  }

  return (
    <div className="space-y-16">
      <section className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 shadow">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Welcome to EduJobs Scholars</h2>
        <p className="opacity-90 max-w-3xl">Your go-to platform for university application updates, job vacancies, and expert consulting services for students and job seekers.</p>
        <div className="mt-6 flex gap-3">
          <a href="#university" className="px-4 py-2 rounded bg-white text-blue-700">Explore Applications</a>
          <a href="#jobs" className="px-4 py-2 rounded border border-white">Find Jobs</a>
        </div>
      </section>

      <section id="jobs" className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">Job Search</h3>
          <div className="flex gap-2 text-sm">
            <label className="flex items-center gap-1"><input type="radio" checked={open==='all'} onChange={()=>setOpen('all')} />All</label>
            <label className="flex items-center gap-1"><input type="radio" checked={open==='open'} onChange={()=>setOpen('open')} />Open</label>
            <label className="flex items-center gap-1"><input type="radio" checked={open==='closed'} onChange={()=>setOpen('closed')} />Closed</label>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Keywords (e.g., Teacher, Engineer)" className="border rounded px-3 py-2" />
          <select value={province} onChange={e=>setProvince(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All Locations</option>
            <option value="Kigali">Kigali</option>
            <option value="Eastern Province">Eastern Province</option>
            <option value="Western Province">Western Province</option>
            <option value="Northern Province">Northern Province</option>
            <option value="Southern Province">Southern Province</option>
          </select>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All Categories</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="it">IT & Technology</option>
            <option value="admin">Administrative</option>
            <option value="engineering">Engineering</option>
          </select>
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Search Jobs</button>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {jobs.map((j, idx) => (
            <div key={idx} className="border rounded p-4">
              <h4 className="font-semibold">{j.title}</h4>
              <p className="text-sm opacity-80">{j.company} • {j.location}</p>
              <div className="mt-2 text-sm">
                <CountdownText target={j.deadline} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="university" className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">University Applications</h3>
          <div className="flex gap-2 text-sm">
            <select value={funding} onChange={e=>setFunding(e.target.value as any)} className="border rounded px-2 py-1">
              <option value="all">All funding</option>
              <option value="supported">Supported</option>
              <option value="self">Self-paid</option>
            </select>
            <select value={open} onChange={e=>setOpen(e.target.value as any)} className="border rounded px-2 py-1">
              <option value="all">All status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 border-b mb-4 overflow-x-auto">
          <button onClick={()=>setTab('rw')} className={`px-4 py-2 ${tab==='rw'?'border-b-2 border-blue-600 text-blue-600':''}`}>Rwanda</button>
          <button onClick={()=>setTab('int')} className={`px-4 py-2 ${tab==='int'?'border-b-2 border-blue-600 text-blue-600':''}`}>International</button>
          <button onClick={()=>setTab('sch')} className={`px-4 py-2 ${tab==='sch'?'border-b-2 border-blue-600 text-blue-600':''}`}>Scholarships</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {list.map((u, idx) => (
            <div key={idx} className="border rounded p-4 hover:shadow transition">
              <div className="text-2xl mb-1">🏛️</div>
              <h4 className="font-semibold">{u.name}</h4>
              <p className="text-xs opacity-70">Funding: {u.funding==='supported'?'Supported':'Self-paid'}</p>
              <div className="mt-2 text-sm">
                <CountdownText target={u.deadline} prefix="Closes in: " />
              </div>
              <button className="mt-3 text-blue-600 text-sm">Learn more</button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="p-6 rounded border bg-white text-center">
          <div className="text-sm opacity-70">Applicants Helped</div>
          <div className="text-4xl font-bold">{applicantsCount}+</div>
        </div>
        <div className="p-6 rounded border bg-white text-center">
          <div className="text-sm opacity-70">Students Registered</div>
          <div className="text-4xl font-bold">{studentsCount}+</div>
        </div>
        <div className="p-6 rounded border bg-white text-center">
          <div className="text-sm opacity-70">Partner Institutions</div>
          <div className="text-4xl font-bold">{partnersCount}+</div>
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4">What students say</h3>
        <div className="relative overflow-hidden">
          <div className="transition-all">
            <blockquote className="text-lg italic">“{testimonials[tIdx].text}”</blockquote>
            <div className="mt-2 text-sm opacity-70">— {testimonials[tIdx].name}</div>
          </div>
          <div className="mt-3 flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} aria-label={`slide ${i+1}`} onClick={()=>setTIdx(i)} className={`h-2 w-2 rounded-full ${i===tIdx?'bg-blue-600':'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-3">Join our newsletter</h3>
        <form onSubmit={subscribe} className="flex gap-3 max-w-xl">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="flex-1 border rounded px-3 py-2" />
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Subscribe</button>
        </form>
        {subMsg && <p className="mt-2 text-green-700 text-sm">{subMsg}</p>}
      </section>

      <section className="bg-white rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4">Our partners</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 opacity-80">
          {['UR','RP','INES','UNILAK','ALU','Carnegie'].map((p,i)=>(
            <div key={i} className="border rounded p-3 text-center text-sm">{p}</div>
          ))}
        </div>
      </section>
    </div>
  )
}



