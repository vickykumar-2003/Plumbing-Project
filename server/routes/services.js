const express = require('express');
const router = express.Router();

const Service = require('../models/Service');
const { protect, isAdmin } = require('../middleware/auth');

// Seed data
const defaultServices = [
  { category: 'Plumbing', title: 'Pipe Repair', description: 'Fast and reliable pipe repair for leaks, bursts, and damage of all kinds.', icon: '🔧', image: '/assets/vlog2.png', price: 'Starting ₹499' },
  { category: 'Plumbing', title: 'Drain Cleaning', description: 'Professional drain cleaning to clear blockages and restore proper flow.', icon: '🚿', image: '/assets/vlog2.png', price: 'Starting ₹399' },
  { category: 'Plumbing', title: 'Water Heater Installation', description: 'Expert installation and servicing of all types of water heaters.', icon: '🌡️', image: '/assets/project1.png', price: 'Starting ₹799' },
  { category: 'Plumbing', title: 'Leak Detection', description: 'Advanced leak detection technology to find hidden leaks before they cause damage.', icon: '💧', image: '/assets/vlog2.png', price: 'Starting ₹599' },
  { category: 'Plumbing', title: 'Bathroom Fitting', description: 'Complete bathroom fixture installation including taps, showers, and toilets.', icon: '🚽', image: '/assets/project1.png', price: 'Starting ₹999' },
  { category: 'Electrical', title: 'Electrical Wiring', description: 'Safe and certified full-home or partial electrical wiring services.', icon: '⚡', image: '/assets/project2.png', price: 'Starting ₹699' },
  { category: 'Electrical', title: 'Switch & Socket Installation', description: 'Quick installation and replacement of switches, sockets, and outlets.', icon: '🔌', image: '/assets/project2.png', price: 'Starting ₹299' },
  { category: 'Electrical', title: 'Fan & Light Fitting', description: 'Professional installation of ceiling fans, lights, and chandeliers.', icon: '💡', image: '/assets/hero.png', price: 'Starting ₹349' },
  { category: 'Electrical', title: 'Circuit Breaker Repair', description: 'Expert diagnosis and repair of circuit breakers and electrical panels.', icon: '🔋', image: '/assets/project2.png', price: 'Starting ₹549' },
  { category: 'Electrical', title: 'Electrical Inspection', description: 'Comprehensive home electrical safety inspection and compliance certification.', icon: '🔍', image: '/assets/project2.png', price: 'Starting ₹449' }
];

// @route   GET /api/services
// @desc    Get all available services
// @access  Public
router.get('/', async (req, res) => {
  try {
    let services = await Service.find({ isActive: true });

    // Auto-seed if empty to prevent frontend breaking
    if (services.length === 0) {
      await Service.insertMany(defaultServices);
      services = await Service.find({ isActive: true });
    }

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    // Fallback to default if DB fails
    res.json(defaultServices);
  }
});

// @route   POST /api/services
// @desc    Add a new service
// @access  Private (Admin)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private (Admin)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private (Admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
