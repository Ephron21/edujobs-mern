import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  category: 'university_application' | 'job_placement' | 'consulting' | 'training' | 'other';
  price: number;
  duration: string; // e.g., "2 weeks", "1 month"
  features: string[];
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      minlength: [20, 'Description must be at least 20 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      enum: ['university_application', 'job_placement', 'consulting', 'training', 'other'],
      required: [true, 'Service category is required']
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Price cannot be negative']
    },
    duration: {
      type: String,
      required: [true, 'Service duration is required'],
      trim: true
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function(features: string[]) {
          return features.length > 0;
        },
        message: 'At least one feature is required'
      }
    },
    imageUrl: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
ServiceSchema.index({ title: 'text', description: 'text' });
ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ isFeatured: 1, isActive: 1 });
ServiceSchema.index({ price: 1 });

// Virtual for formatted price
ServiceSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
