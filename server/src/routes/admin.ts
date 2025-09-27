import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Application from '../models/Application';
import User from '../models/User';
import { requireAdmin } from './auth';

const router = Router();

// Get admin dashboard statistics
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [applicationsCount, usersCount, recentApplications] = await Promise.all([
      Application.countDocuments({}),
      User.countDocuments({ role: { $ne: 'admin' } }), // Count non-admin users
      Application.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email createdAt status')
    ]);

    // Get application status breakdown
    const statusStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusBreakdown = {
      pending: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      accepted: 0,
      rejected: 0
    };

    statusStats.forEach(stat => {
      if (statusBreakdown.hasOwnProperty(stat._id)) {
        statusBreakdown[stat._id] = stat.count;
      }
    });

    res.json({
      success: true,
      data: {
        applicantsCount: applicationsCount,
        studentsCount: usersCount,
        recentApplicants: recentApplications,
        recentStudents: [], // Empty for now, can be populated when student system is implemented
        statusBreakdown
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get uploaded files
router.get('/files', requireAdmin, async (req: Request, res: Response) => {
  try {
    const uploadsDir = path.resolve('uploads');
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        data: { files: [] }
      });
    }

    const files = await fs.promises.readdir(uploadsDir, { withFileTypes: true });
    const fileList = await Promise.all(
      files
        .filter(dirent => dirent.isFile())
        .map(async (dirent) => {
          const filePath = path.join(uploadsDir, dirent.name);
          const stat = await fs.promises.stat(filePath);
          return {
            name: dirent.name,
            size: stat.size,
            mtime: stat.mtime,
            type: path.extname(dirent.name).toLowerCase()
          };
        })
    );

    // Sort by modification time (newest first)
    fileList.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    res.json({
      success: true,
      data: { files: fileList }
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch files'
    });
  }
});

export default router;