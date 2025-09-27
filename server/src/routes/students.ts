import { Router } from 'express'
import { Student } from '../models/Student.js'

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Student.find().lean()
  res.json(items)
})

router.post('/', async (req, res) => {
  const created = await Student.create(req.body)
  res.status(201).json(created)
})

export default router




