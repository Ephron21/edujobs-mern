import mongoose, { Schema, type InferSchemaType } from 'mongoose'

const JobSchema = new Schema(
  {
    title: { type: String, required: true, index: 'text' },
    company: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true, index: true },
    category: { type: String, default: '', index: true },
    tags: { type: [String], default: [], index: true },
    description: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    postedAt: { type: Date, default: () => new Date(), index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

JobSchema.index({ title: 'text', description: 'text', company: 'text', tags: 'text' })

export type Job = InferSchemaType<typeof JobSchema>
export const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema)
