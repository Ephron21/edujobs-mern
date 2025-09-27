import { Router } from 'express'
import { Staff } from '../models/Staff.js'

const router = Router()

router.get('/', async (_req, res) => {
  const items = await Staff.find().lean()
  res.json(items)
})

router.post('/', async (req, res) => {
  const created = await Staff.create(req.body)
  res.status(201).json(created)
})

export default router




