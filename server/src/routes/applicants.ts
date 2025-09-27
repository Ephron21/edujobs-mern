import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Applicant } from '../models/Applicant.js'

const router = Router()

const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
})

const allowed = ['application/pdf', 'image/jpeg', 'image/png']
function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!allowed.includes(file.mimetype)) return cb(new Error('Only PDF, JPG or PNG files are allowed'))
  cb(null, true)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })

router.get('/', async (_req, res) => {
  const items = await Applicant.find().sort({ createdAt: -1 }).lean()
  res.json(items)
})

router.post('/', (req, res, next) => {
  upload.fields([
    { name: 'id_document', maxCount: 1 },
    { name: 'diploma', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
  ])(req, res, async (err: any) => {
    if (err) return next(err)
    try {
      const body = req.body as any
      const files = req.files as any
      console.log('[apply] body keys:', Object.keys(body||{}))
      console.log('[apply] files:', {
        id_document: files?.id_document?.[0]?.originalname,
        diploma: files?.diploma?.[0]?.originalname,
        profile_image: files?.profile_image?.[0]?.originalname,
      })
      const errors: Record<string, string> = {}

      const phoneRx = /^\+?[0-9\s\-]{7,15}$/
      function reqd(k: string, label: string) {
        if (!body[k] || String(body[k]).trim() === '') errors[k] = `${label} is required`
      }

      reqd('firstname','First name')
      reqd('lastname','Last name')
      if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.email = 'Valid email is required'
      if (!phoneRx.test(body.phone || '')) errors.phone = 'Valid phone is required'
      reqd('gender','Gender')
      // Optional fields validated only if present
      ;['father_name','father_phone','mother_name','mother_phone','province','district','sector','cell','village'].forEach(k => {
        if (body[k]) {
          if (k === 'father_phone' || k === 'mother_phone') {
            if (!phoneRx.test(body[k])) errors[k] = 'Valid phone is required'
          }
        }
      })

      if (!files?.id_document?.[0]) errors.id_document = 'ID document is required'
      if (!files?.diploma?.[0]) errors.diploma = 'Diploma/Certificate is required'
      if (!files?.profile_image?.[0]) errors.profile_image = 'Profile image is required'

      if (Object.keys(errors).length) return res.status(400).json({ message: 'Please fix the highlighted fields', errors })

      const created = await Applicant.create({
        firstName: body.firstname,
        lastName: body.lastname,
        email: body.email,
        phone: body.phone,
        program: body.program || '',
        level: body.level || '',
        notes: body.notes || '',
        fatherName: body.father_name || '',
        fatherPhone: body.father_phone || '',
        motherName: body.mother_name || '',
        motherPhone: body.mother_phone || '',
        province: body.province || '',
        district: body.district || '',
        sector: body.sector || '',
        cell: body.cell || '',
        village: body.village || '',
        idDocumentPath: files.id_document?.[0]?.filename,
        diplomaPath: files.diploma?.[0]?.filename,
        profileImagePath: files.profile_image?.[0]?.filename,
      } as any)

      res.status(201).json(created)
    } catch (e) {
      next(e)
    }
  })
})

export default router
