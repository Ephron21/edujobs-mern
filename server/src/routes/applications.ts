import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Application from '../models/Application';
import { requireAuth, requireAdmin } from './auth';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/applications';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed!'));
    }
  }
});

// POST /api/applications - Submit application (public)
router.post('/', upload.fields([
  { name: 'id_document', maxCount: 1 },
  { name: 'diploma', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    console.log('Received application data:', req.body);
    console.log('Received files:', req.files);

    const {
      firstname,
      lastname,
      email,
      phone,
      gender,
      father_name,
      father_phone,
      mother_name,
      mother_phone,
      province,
      district,
      sector,
      cell,
      village,
      serviceType = 'job_application'
    } = req.body;

    // Basic validation - only check essential fields
    const requiredFields = [
      'firstname', 'lastname', 'email', 'phone', 'gender',
      'father_name', 'father_phone', 'mother_name', 'mother_phone',
      'province', 'district', 'sector'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        errors: missingFields.reduce((acc, field) => {
          acc[field] = 'This field is required';
          return acc;
        }, {} as Record<string, string>)
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        errors: { email: 'Please enter a valid email address' }
      });
    }

    // Phone validation - more lenient
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    const phoneErrors: Record<string, string> = {};
    
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      phoneErrors.phone = 'Please enter a valid phone number';
    }
    if (!phoneRegex.test(father_phone.replace(/\s/g, ''))) {
      phoneErrors.father_phone = 'Please enter a valid phone number';
    }
    if (!phoneRegex.test(mother_phone.replace(/\s/g, ''))) {
      phoneErrors.mother_phone = 'Please enter a valid phone number';
    }

    if (Object.keys(phoneErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
        errors: phoneErrors
      });
    }

    // Check if application already exists for this email
    const existingApplication = await Application.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists',
        errors: { email: 'Application already submitted with this email' }
      });
    }

    // Handle file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const resumeUrl = files?.id_document?.[0]?.path;
    const certificatesUrl = files?.diploma?.[0]?.path ? [files.diploma[0].path] : [];

    // Create application with proper field mapping
    const application = new Application({
      firstName: firstname,
      lastName: lastname,
      email,
      phone,
      gender,
      fatherName: father_name,
      fatherPhone: father_phone,
      motherName: mother_name,
      motherPhone: mother_phone,
      province,
      district,
      sector,
      cell: cell || '',
      village: village || '',
      serviceType,
      resumeUrl,
      certificatesUrl,
      educationLevel: 'secondary', // Default value
      status: 'pending'
    });

    await application.save();
    console.log('Application saved successfully:', application._id);

    res.status(201).json({
      success: true,
      data: { application },
      message: 'Application submitted successfully! We will review your application and get back to you soon.'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {} as Record<string, string>);
      
      console.log('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.'
    });
  }
});

// GET /api/applications/admin/all - Get all applications (admin only)
router.get('/admin/all', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, serviceType, search } = req.query;
    
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (serviceType && serviceType !== 'all') {
      query.serviceType = serviceType;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('reviewedBy', 'username email');

    const total = await Application.countDocuments(query);

    // Get statistics
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      pending: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      accepted: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        statistics: statusStats
      },
      message: 'Applications retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// GET /api/applications/admin/:id - Get single application (admin only)
router.get('/admin/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('reviewedBy', 'username email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: { application },
      message: 'Application retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

// PUT /api/applications/admin/:id/status - Update application status (admin only)
router.put('/admin/:id/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        reviewedBy: (req as any).user.userId,
        reviewedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('reviewedBy', 'username email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: { application },
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application'
    });
  }
});

// DELETE /api/applications/admin/:id - Delete application (admin only)
router.delete('/admin/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Clean up uploaded files
    const filesToDelete = [
      application.resumeUrl,
      ...(application.certificatesUrl || [])
    ].filter(Boolean);

    filesToDelete.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application'
    });
  }
});

export default router;