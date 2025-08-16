import express from 'express';
import DiagnosticService from '../models/DiagnosticService.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all diagnostic services
router.get('/', async (req, res) => {
  try {
    const { category, popular, search } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by popular
    if (popular === 'true') {
      query.popular = true;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'tests.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    const services = await DiagnosticService.find(query).sort({ name: 1 });
    
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching diagnostic services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic services',
      error: error.message
    });
  }
});

// Get diagnostic service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await DiagnosticService.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching diagnostic service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic service',
      error: error.message
    });
  }
});

// Get diagnostic services by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const services = await DiagnosticService.find({ 
      category, 
      isActive: true 
    }).sort({ name: 1 });
    
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching diagnostic services by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic services by category',
      error: error.message
    });
  }
});

// Get popular diagnostic services
router.get('/popular/all', async (req, res) => {
  try {
    const popularServices = await DiagnosticService.find({ 
      popular: true, 
      isActive: true 
    }).sort({ name: 1 });
    
    res.json({
      success: true,
      data: popularServices,
      count: popularServices.length
    });
  } catch (error) {
    console.error('Error fetching popular diagnostic services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular diagnostic services',
      error: error.message
    });
  }
});

// Search diagnostic services
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;
    
    const searchRegex = new RegExp(query, 'i');
    
    const services = await DiagnosticService.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { 'tests.name': searchRegex },
        { 'packages.name': searchRegex }
      ],
      isActive: true
    })
    .limit(parseInt(limit))
    .sort({ name: 1 });
    
    res.json({
      success: true,
      data: services,
      count: services.length,
      query
    });
  } catch (error) {
    console.error('Error searching diagnostic services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search diagnostic services',
      error: error.message
    });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await DiagnosticService.distinct('category');
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching diagnostic service categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic service categories',
      error: error.message
    });
  }
});

// Admin: Create new diagnostic service (protected route)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    
    const service = new DiagnosticService(req.body);
    await service.save();
    
    res.status(201).json({
      success: true,
      message: 'Diagnostic service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating diagnostic service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create diagnostic service',
      error: error.message
    });
  }
});

// Admin: Update diagnostic service (protected route)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    
    const service = await DiagnosticService.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Diagnostic service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating diagnostic service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update diagnostic service',
      error: error.message
    });
  }
});

// Admin: Delete diagnostic service (protected route)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    
    const service = await DiagnosticService.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic service not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Diagnostic service deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating diagnostic service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate diagnostic service',
      error: error.message
    });
  }
});

export default router; 