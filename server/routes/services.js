const express = require('express');
const router = express.Router();

const services = [
  {
    id: 1,
    category: 'Plumbing',
    title: 'Pipe Repair',
    description: 'Fast and reliable pipe repair for leaks, bursts, and damage of all kinds.',
    icon: '🔧',
    image: '/assets/vlog2.png',
    price: 'Starting ₹499',
  },
  {
    id: 2,
    category: 'Plumbing',
    title: 'Drain Cleaning',
    description: 'Professional drain cleaning to clear blockages and restore proper flow.',
    icon: '🚿',
    image: '/assets/vlog2.png',
    price: 'Starting ₹399',
  },
  {
    id: 3,
    category: 'Plumbing',
    title: 'Water Heater Installation',
    description: 'Expert installation and servicing of all types of water heaters.',
    icon: '🌡️',
    image: '/assets/project1.png',
    price: 'Starting ₹799',
  },
  {
    id: 4,
    category: 'Plumbing',
    title: 'Leak Detection',
    description: 'Advanced leak detection technology to find hidden leaks before they cause damage.',
    icon: '💧',
    image: '/assets/vlog2.png',
    price: 'Starting ₹599',
  },
  {
    id: 5,
    category: 'Plumbing',
    title: 'Bathroom Fitting',
    description: 'Complete bathroom fixture installation including taps, showers, and toilets.',
    icon: '🚽',
    image: '/assets/project1.png',
    price: 'Starting ₹999',
  },
  {
    id: 6,
    category: 'Electrical',
    title: 'Electrical Wiring',
    description: 'Safe and certified full-home or partial electrical wiring services.',
    icon: '⚡',
    image: '/assets/project2.png',
    price: 'Starting ₹699',
  },
  {
    id: 7,
    category: 'Electrical',
    title: 'Switch & Socket Installation',
    description: 'Quick installation and replacement of switches, sockets, and outlets.',
    icon: '🔌',
    image: '/assets/project2.png',
    price: 'Starting ₹299',
  },
  {
    id: 8,
    category: 'Electrical',
    title: 'Fan & Light Fitting',
    description: 'Professional installation of ceiling fans, lights, and chandeliers.',
    icon: '💡',
    image: '/assets/hero.png',
    price: 'Starting ₹349',
  },
  {
    id: 9,
    category: 'Electrical',
    title: 'Circuit Breaker Repair',
    description: 'Expert diagnosis and repair of circuit breakers and electrical panels.',
    icon: '🔋',
    image: '/assets/project2.png',
    price: 'Starting ₹549',
  },
  {
    id: 10,
    category: 'Electrical',
    title: 'Electrical Inspection',
    description: 'Comprehensive home electrical safety inspection and compliance certification.',
    icon: '🔍',
    image: '/assets/project2.png',
    price: 'Starting ₹449',
  },
];

// @route   GET /api/services
// @desc    Get all available services
// @access  Public
router.get('/', (req, res) => {
  res.json(services);
});

module.exports = router;
