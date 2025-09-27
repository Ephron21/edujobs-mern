import mongoose from 'mongoose'

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  program: { type: String },
  level: { type: String },
  notes: { type: String },
}, { timestamps: true })

export const Applicant = mongoose.model('Applicant', applicantSchema)


