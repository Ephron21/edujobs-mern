import { Router, Request, Response } from 'express';
import Service from '../models/Service';
import { requireAuth, requireAdmin } from './auth';

const router = Router();

// GET /api/services - Get all active services (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12, category, featured, search } = req.query;
    
    const query: any = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }

    const services = await Service.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('createdBy', 'username');

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      },
      message: 'Services retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// GET /api/services/:id - Get single service (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('createdBy', 'username');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: { service },
      message: 'Service retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// GET /api/services/admin/all - Get all services (admin only)
router.get('/admin/all', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('createdBy', 'username');

    const total = await Service.countDocuments();

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      },
      message: 'All services retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// POST /api/services - Create new service (admin only)
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: (req as any).user.userId
    };

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      success: true,
      data: { service },
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
});

// PUT /api/services/:id - Update service (admin only)
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: { service },
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// PUT /api/services/:id/toggle-active - Toggle service active status (admin only)
router.put('/:id/toggle-active', requireAdmin, async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      success: true,
      data: { service },
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// DELETE /api/services/:id - Delete service (admin only)
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

export default router;
