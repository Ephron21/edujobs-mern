import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true },
  program: { type: String },
  year: { type: Number },
}, { timestamps: true })

export const Student = mongoose.model('Student', studentSchema)




