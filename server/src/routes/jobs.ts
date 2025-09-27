import { Router } from 'express';
import { JobModel } from '../models/Job';
import { requireAdmin } from './auth';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '12'), 10) || 12));
    const type = (req.query.type as string | undefined)?.trim();
    const location = (req.query.location as string | undefined)?.trim();
    const category = (req.query.category as string | undefined)?.trim();
    const featured = req.query.featured === 'true';
    const sort = (req.query.sort as string | undefined)?.trim();

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');
    if (category) filter.category = new RegExp(category, 'i');
    if (req.query.featured !== undefined) filter.isFeatured = featured;

    let sortSpec: any = { postedAt: -1 };
    if (sort === 'oldest') sortSpec = { postedAt: 1 };
    if (sort === 'company') sortSpec = { company: 1 };

    const [items, total] = await Promise.all([
      JobModel.find(filter).sort(sortSpec).skip((page - 1) * limit).limit(limit).lean(),
      JobModel.countDocuments(filter),
    ]);

    res.json({ 
      success: true,
      data: {
        items, 
        pagination: {
          page, 
          limit, 
          total, 
          pages: Math.ceil(total / limit)
        }
      },
      message: 'Jobs retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await JobModel.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ 
      success: false,
      message: 'Job not found'
    });
    res.json({ 
      success: true,
      data: doc,
      message: 'Job retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    });
  }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const created = await JobModel.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      type: req.body.type,
      category: req.body.category || '',
      tags: req.body.tags || [],
      description: req.body.description || '',
      applyUrl: req.body.applyUrl || '',
      postedAt: req.body.postedAt ? new Date(req.body.postedAt) : new Date(),
      isFeatured: Boolean(req.body.isFeatured),
    });
    res.status(201).json({ 
      success: true,
      data: created,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job'
    });
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const updated = await JobModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          type: req.body.type,
          category: req.body.category,
          tags: req.body.tags,
          description: req.body.description,
          applyUrl: req.body.applyUrl,
          postedAt: req.body.postedAt ? new Date(req.body.postedAt) : undefined,
          isFeatured: req.body.isFeatured,
        },
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ 
      success: false,
      message: 'Job not found'
    });
    res.json({ 
      success: true,
      data: updated,
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job'
    });
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await JobModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ 
      success: false,
      message: 'Job not found'
    });
    res.json({ 
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job'
    });
  }
});

export default router;
