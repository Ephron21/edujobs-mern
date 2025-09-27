import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const UniversitySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    country: { type: String, default: '', index: true },
    funding: { type: String, enum: ['supported', 'self'], default: 'self', index: true },
    deadline: { type: Date, default: null },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    logoPath: { type: String, default: '' },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)

export type University = InferSchemaType<typeof UniversitySchema>
export const UniversityModel = mongoose.models.University || mongoose.model('University', UniversitySchema)
