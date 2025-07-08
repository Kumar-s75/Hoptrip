const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/trip');
const { authenticateToken } = require('../middleware/auth');

// Get user profile with privacy settings
router.get('/:userId/profile', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-refreshToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Public profile information
    const publicProfile = {
      _id: user._id,
      name: user.name,
      photo: user.photo,
      // Add more public fields as needed
    };

    res.status(200).json({ user: publicProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's public trips
router.get('/:userId/trips/public', async (req, res) => {
  const { userId } = req.params;
  const { limit = 10, offset = 0 } = req.query;

  try {
    const trips = await Trip.find({
      $or: [{ host: userId }, { travelers: userId }],
      visibility: 'public'
    })
    .populate('host', 'name photo')
    .populate('travelers', 'name photo')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users
router.get('/search', async (req, res) => {
  const { query, limit = 10 } = req.query;

  try {
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
    .select('name email photo')
    .limit(parseInt(limit));

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user preferences
router.patch('/:userId/preferences', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { preferences } = req.body;

  try {
    // Users can only update their own preferences
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        preferences: { ...preferences },
        updatedAt: new Date()
      },
      { new: true }
    ).select('-refreshToken');

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deactivate user account
router.patch('/:userId/deactivate', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Users can only deactivate their own account
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to deactivate this account' });
    }

    await User.findByIdAndUpdate(userId, { 
      isActive: false,
      updatedAt: new Date()
    });

    res.status(200).json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;