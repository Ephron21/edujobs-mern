import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  
  // Family Information
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  
  // Location Information
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  
  // Education Information
  educationLevel: 'primary' | 'secondary' | 'university' | 'masters' | 'phd';
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  
  // Job Application Details
  jobId?: Schema.Types.ObjectId;
  jobTitle?: string;
  serviceType: 'job_application' | 'university_application' | 'scholarship' | 'other';
  preferredJobType?: 'full_time' | 'part_time' | 'contract' | 'internship';
  expectedSalary?: number;
  
  // Documents
  resumeUrl?: string;
  coverLetterUrl?: string;
  certificatesUrl?: string[];
  
  // Application Status
  status: 'pending' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  
  // Admin fields
  reviewedBy?: Schema.Types.ObjectId;
  reviewedAt?: Date;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
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
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required']
    },
    
    // Family Information
    fatherName: {
      type: String,
      required: [true, 'Father name is required'],
      trim: true,
      maxlength: [100, 'Father name cannot exceed 100 characters']
    },
    fatherPhone: {
      type: String,
      required: [true, 'Father phone is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    motherName: {
      type: String,
      required: [true, 'Mother name is required'],
      trim: true,
      maxlength: [100, 'Mother name cannot exceed 100 characters']
    },
    motherPhone: {
      type: String,
      required: [true, 'Mother phone is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    
    // Location Information
    province: {
      type: String,
      required: [true, 'Province is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    sector: {
      type: String,
      required: [true, 'Sector is required'],
      trim: true
    },
    cell: {
      type: String,
      trim: true
    },
    village: {
      type: String,
      trim: true
    },
    
    // Education Information
    educationLevel: {
      type: String,
      enum: ['primary', 'secondary', 'university', 'masters', 'phd'],
      required: [true, 'Education level is required']
    },
    institution: {
      type: String,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    graduationYear: {
      type: Number,
      min: [1950, 'Graduation year must be after 1950'],
      max: [new Date().getFullYear() + 10, 'Graduation year cannot be too far in the future']
    },
    
    // Job Application Details
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job'
    },
    jobTitle: {
      type: String,
      trim: true
    },
    serviceType: {
      type: String,
      enum: ['job_application', 'university_application', 'scholarship', 'other'],
      required: [true, 'Service type is required']
    },
    preferredJobType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship']
    },
    expectedSalary: {
      type: Number,
      min: [0, 'Expected salary cannot be negative']
    },
    
    // Documents
    resumeUrl: {
      type: String
    },
    coverLetterUrl: {
      type: String
    },
    certificatesUrl: {
      type: [String],
      default: []
    },
    
    // Application Status
    status: {
      type: String,
      enum: ['pending', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    
    // Admin fields
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ status: 1, priority: 1 });
ApplicationSchema.index({ jobId: 1 });
ApplicationSchema.index({ serviceType: 1 });
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ reviewedBy: 1 });

// Virtual for full name
ApplicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted creation date
ApplicationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual to check if application is recent (within last 7 days)
ApplicationSchema.virtual('isRecent').get(function() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.createdAt > oneWeekAgo;
});

export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
