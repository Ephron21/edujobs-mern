import { Router, Request, Response } from 'express';
import Contact from '../models/Contact';
import { requireAuth, requireAdmin } from './auth';

const router = Router();

// POST /api/contact - Submit contact form (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      data: { contact },
      message: 'Contact form submitted successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

// GET /api/contact/admin/all - Get all contacts (admin only)
router.get('/admin/all', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;
    
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('assignedTo', 'username email')
      .populate('respondedBy', 'username email');

    const total = await Contact.countDocuments(query);

    // Get statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      new: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        statistics: statusStats
      },
      message: 'Contacts retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

// GET /api/contact/admin/:id - Get single contact (admin only)
router.get('/admin/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('respondedBy', 'username email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: { contact },
      message: 'Contact retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
});

// PUT /api/contact/admin/:id/status - Update contact status (admin only)
router.put('/admin/:id/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'username email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: { contact },
      message: 'Contact updated successfully'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// PUT /api/contact/admin/:id/respond - Respond to contact (admin only)
router.put('/admin/:id/respond', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { response } = req.body;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response is required'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        response: response.trim(),
        respondedAt: new Date(),
        respondedBy: (req as any).user.userId,
        status: 'resolved'
      },
      { new: true, runValidators: true }
    ).populate('respondedBy', 'username email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: { contact },
      message: 'Response sent successfully'
    });
  } catch (error) {
    console.error('Error responding to contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send response'
    });
  }
});

// DELETE /api/contact/admin/:id - Delete contact (admin only)
router.delete('/admin/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

export default router;
