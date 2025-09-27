import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String },
}, { timestamps: true })

export const Teacher = mongoose.model('Teacher', teacherSchema)




