const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const { authenticateToken } = require('../middleware/auth');

// Get all trips for a user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { status, limit = 10, offset = 0 } = req.query;

  try {
    let query = {
      $or: [{ host: userId }, { travelers: userId }]
    };

    if (status) {
      query.status = status;
    }

    const trips = await Trip.find(query)
      .populate('travelers', 'name email photo')
      .populate('host', 'name email photo')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Trip.countDocuments(query);

    res.status(200).json({
      trips,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Duplicate trip
router.post('/:tripId/duplicate', authenticateToken, async (req, res) => {
  const { tripId } = req.params;

  try {
    const originalTrip = await Trip.findById(tripId);
    
    if (!originalTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user has access to the trip
    if (originalTrip.host.toString() !== req.user.userId && 
        !originalTrip.travelers.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to duplicate this trip' });
    }

    const duplicatedTrip = new Trip({
      ...originalTrip.toObject(),
      _id: undefined,
      tripName: `${originalTrip.tripName} (Copy)`,
      host: req.user.userId,
      travelers: [req.user.userId],
      expenses: [], // Reset expenses
      status: 'planning',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await duplicatedTrip.save();
    
    const populatedTrip = await Trip.findById(duplicatedTrip._id)
      .populate('travelers', 'name email photo')
      .populate('host', 'name email photo');

    res.status(201).json(populatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Archive trip
router.patch('/:tripId/archive', authenticateToken, async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Only host can archive trip
    if (trip.host.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only trip host can archive the trip' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { status: 'completed', updatedAt: new Date() },
      { new: true }
    ).populate('travelers', 'name email photo');

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;