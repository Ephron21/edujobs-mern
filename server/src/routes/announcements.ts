import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  mediaUrl?: string;
  createdBy: Schema.Types.ObjectId;
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: { 
      type: String, 
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters long']
    },
    mediaUrl: { 
      type: String,
      default: null
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    featured: { 
      type: Boolean, 
      default: false 
    },
    published: { 
      type: Boolean, 
      default: false 
    },
    publishedAt: { 
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add text index for search
AnnouncementSchema.index({ title: 'text', content: 'text' });

// Virtual for formatted date
AnnouncementSchema.virtual('formattedDate').get(function() {
  return this.publishedAt?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) || '';
});

// Pre-save hook to set publishedAt
AnnouncementSchema.pre('save', function(next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);