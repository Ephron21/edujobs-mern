import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { UniversityModel } from '../models/University.js'
import { requireAdmin } from './auth.js'

const router = Router()

const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
})
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })

// Public list
router.get('/', async (req, res, next) => {
  try {
    const funding = (req.query.funding as string | undefined)?.trim()
    const country = (req.query.country as string | undefined)?.trim()
    const filter: any = { published: true }
    if (funding) filter.funding = funding
    if (country) filter.country = new RegExp(country, 'i')
    const items = await UniversityModel.find(filter).sort({ name: 1 }).lean()
    res.json(items)
  } catch (e) {
    next(e)
  }
})

// Admin list
router.get('/admin', requireAdmin, async (_req, res, next) => {
  try {
    const items = await UniversityModel.find().sort({ createdAt: -1 }).lean()
    res.json(items)
  } catch (e) {
    next(e)
  }
})

// Create (admin)
router.post('/', requireAdmin, (req, res, next) => {
  upload.single('logo')(req, res, async (err: any) => {
    if (err) return next(err)
    try {
      const file = req.file as Express.Multer.File | undefined
      const created = await UniversityModel.create({
        name: req.body.name,
        country: req.body.country || '',
        funding: req.body.funding || 'self',
        deadline: req.body.deadline ? new Date(req.body.deadline) : null,
        website: req.body.website || '',
        description: req.body.description || '',
        logoPath: file?.filename || '',
        published: req.body.published === 'false' ? false : true,
      })
      res.status(201).json(created)
    } catch (e) {
      next(e)
    }
  })
})

// Update (admin)
router.put('/:id', requireAdmin, (req, res, next) => {
  upload.single('logo')(req, res, async (err: any) => {
    if (err) return next(err)
    try {
      const file = req.file as Express.Multer.File | undefined
      const patch: any = {
        name: req.body.name,
        country: req.body.country,
        funding: req.body.funding,
        deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
        website: req.body.website,
        description: req.body.description,
        published: req.body.published,
      }
      if (file) patch.logoPath = file.filename
      const updated = await UniversityModel.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true })
      if (!updated) return res.status(404).json({ message: 'Not found' })
      res.json(updated)
    } catch (e) {
      next(e)
    }
  })
})

// Delete (admin)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const doc = await UniversityModel.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
