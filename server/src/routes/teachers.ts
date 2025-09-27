import { Router } from 'express'
import { Teacher } from '../models/Teacher.js'

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Teacher.find().lean()
  res.json(items)
})

router.post('/', async (req, res) => {
  const created = await Teacher.create(req.body)
  res.status(201).json(created)
})

export default router




