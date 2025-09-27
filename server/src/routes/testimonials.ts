import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  isApproved: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters']
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      minlength: [10, 'Content must be at least 10 characters long'],
      maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    imageUrl: {
      type: String,
      default: null
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
TestimonialSchema.index({ isApproved: 1, featured: 1 });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ createdAt: -1 });

// Virtual for star display
TestimonialSchema.virtual('stars').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);