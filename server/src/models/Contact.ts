import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: Schema.Types.ObjectId;
  response?: string;
  respondedAt?: Date;
  respondedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters long'],
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'closed'],
      default: 'new'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    response: {
      type: String,
      maxlength: [2000, 'Response cannot exceed 2000 characters']
    },
    respondedAt: {
      type: Date,
      default: null
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
ContactSchema.index({ status: 1, priority: 1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ assignedTo: 1 });

// Virtual for formatted creation date
ContactSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual to check if contact is overdue (new contacts older than 24 hours)
ContactSchema.virtual('isOverdue').get(function() {
  if (this.status === 'new') {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.createdAt < oneDayAgo;
  }
  return false;
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
