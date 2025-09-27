import { useState } from 'react'

type FormData = {
  firstname: string
  lastname: string
  email: string
  phone: string
  gender: string
  father_name: string
  father_phone: string
  mother_name: string
  mother_phone: string
  province: string
  district: string
  sector: string
  cell: string
  village: string
}

const initial: FormData = {
  firstname: '', lastname: '', email: '', phone: '', gender: '',
  father_name: '', father_phone: '', mother_name: '', mother_phone: '',
  province: '', district: '', sector: '', cell: '', village: ''
}

export default function Apply() {
  const [data, setData] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [diploma, setDiploma] = useState<File | null>(null)
  const [profile, setProfile] = useState<File | null>(null)

  function validate(d: FormData) {
    const e: Record<string, string> = {}
    if (!d.firstname.trim()) e.firstname = 'Required'
    if (!d.lastname.trim()) e.lastname = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Valid email required'
    const phoneRx = /^\+?[0-9]{10,15}$/
    if (!phoneRx.test(d.phone)) e.phone = 'Valid phone required'
    if (!phoneRx.test(d.father_phone)) e.father_phone = 'Valid phone required'
    if (!phoneRx.test(d.mother_phone)) e.mother_phone = 'Valid phone required'
    if (!d.gender) e.gender = 'Required'
    ;(['province','district','sector','cell','village'] as const).forEach(k => { if (!(d as any)[k]) e[k]= 'Required' })
    if (!idDocument) e.id_document = 'Required'
    if (!diploma) e.diploma = 'Required'
    if (!profile) e.profile_image = 'Required'
    return e
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    const v = validate(data)
    setErrors(v)
    if (Object.keys(v).length) return
    setStatus('submitting')
    try {
      const form = new FormData()
      Object.entries(data).forEach(([k, v]) => form.append(k, String(v)))
      if (idDocument) form.append('id_document', idDocument)
      if (diploma) form.append('diploma', diploma)
      if (profile) form.append('profile_image', profile)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, { method: 'POST', body: form })
      if (!res.ok) {
        let body: any = null
        try { body = await res.json() } catch {
          try { const text = await res.text(); body = { message: text } } catch { body = null }
        }
        if (body?.errors) setErrors(body.errors)
        setErrorMsg(body?.message || `Submission failed (HTTP ${res.status}).`)
        setStatus('error')
        return
      }
      const result = await res.json()
      setStatus('success')
      setData(initial)
      setErrors({})
      setIdDocument(null); setDiploma(null); setProfile(null)
      setErrorMsg(result.message || 'Application submitted successfully!')
    } catch (err) {
      console.error('Network error:', err)
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  function text(name: keyof FormData, label: string, type = 'text', required = false) {
    return (
      <div>
        <label className="block text-sm mb-1" htmlFor={name}>{label}{required && ' *'}</label>
        <input id={name} type={type} value={data[name]} onChange={e => setData({ ...data, [name]: e.target.value })}
               className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`} />
        {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
      </div>
    )
  }

  function file(label: string, onChange: (f: File | null) => void, accept: string, name: string) {
    return (
      <div>
        <label className="block text-sm mb-1">{label} *</label>
        <input type="file" accept={accept} onChange={e => onChange(e.target.files?.[0] || null)}
               className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`} />
        {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Registration Form</h2>
      <form onSubmit={submit} className="grid gap-6 max-w-3xl">
        <fieldset className="grid gap-4 p-4 border rounded">
          <legend className="font-semibold">Personal Information</legend>
          <div className="grid md:grid-cols-2 gap-4">
            {text('firstname','First Name','text',true)}
            {text('lastname','Last Name','text',true)}
          </div>
          {text('email','Email Address','email',true)}
          {text('phone','Phone Number','tel',true)}
          <div>
            <label className="block text-sm mb-1">Gender *</label>
            <div className="flex gap-4">
              {['male','female','other'].map(g => (
                <label key={g} className="flex items-center gap-2">
                  <input type="radio" name="gender" value={g} checked={data.gender===g} onChange={e => setData({...data, gender: e.target.value})} />
                  <span className="capitalize">{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
          </div>
        </fieldset>

        <fieldset className="grid gap-4 p-4 border rounded">
          <legend className="font-semibold">Parent Information</legend>
          <div className="grid md:grid-cols-2 gap-4">
            {text('father_name',"Father's Name",'text',true)}
            {text('father_phone',"Father's Phone Number",'tel',true)}
            {text('mother_name',"Mother's Name",'text',true)}
            {text('mother_phone',"Mother's Phone Number",'tel',true)}
          </div>
        </fieldset>

        <fieldset className="grid gap-4 p-4 border rounded">
          <legend className="font-semibold">Place of Issue</legend>
          <div className="grid md:grid-cols-3 gap-4">
            {text('province','Province','text',true)}
            {text('district','District','text',true)}
            {text('sector','Sector','text',true)}
            {text('cell','Cell','text',true)}
            {text('village','Village','text',true)}
          </div>
        </fieldset>

        <fieldset className="grid gap-4 p-4 border rounded">
          <legend className="font-semibold">Document Upload</legend>
          {file('ID Document (PDF, JPG, PNG)', setIdDocument, '.pdf,.jpg,.jpeg,.png', 'id_document')}
          {file('Diploma/Certificate (PDF, JPG, PNG)', setDiploma, '.pdf,.jpg,.jpeg,.png', 'diploma')}
          {file('Profile Image (JPG, PNG)', setProfile, '.jpg,.jpeg,.png', 'profile_image')}
        </fieldset>

        <div className="flex gap-3 items-center">
          <button disabled={status==='submitting'} type="submit" className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
            {status==='submitting' ? 'Submitting...' : 'Submit Registration'}
          </button>
          <button type="button" onClick={()=>{setData(initial); setErrors({}); setIdDocument(null); setDiploma(null); setProfile(null); setErrorMsg(''); setStatus('idle')}} className="px-4 py-2 rounded border">Reset</button>
          {status==='success' && <span className="text-green-600">{errorMsg || 'Submitted!'}</span>}
          {status==='error' && <span className="text-red-600">{errorMsg || 'Submission failed.'}</span>}
        </div>
      </form>
    </div>
  )
}