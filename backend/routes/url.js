const express = require('express');
const { nanoid } = require("nanoid");
const validator = require('validator');
const Url = require('../models/url');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');


const router = express.Router();


router.post('/shorten', optionalAuth, async (req, res) => {
  
  try {
    const { originalUrl } = req.body;

    
    if (!originalUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    if (!validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid URL format. Please include http:// or https://' 
      });
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    
    while (!isUnique) {
      shortCode = nanoid(8);
      const existing = await Url.findOne({ shortCode });
      if (!existing) isUnique = true;
    }

    // Create URL entry
    const urlEntry = new Url({
      originalUrl,
      shortCode,
      userId: req.userId || null
    });

    await urlEntry.save();

    res.status(201).json({
      success: true,
      message: 'Short URL created successfully',
      data: {
        originalUrl: urlEntry.originalUrl,
        shortCode: urlEntry.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${urlEntry.shortCode}`,
        createdAt: urlEntry.createdAt
      }
    });
  } catch (error) {
    console.error('Shorten URL error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating short URL' 
    });
  }
});

// GET /:shortCode - Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Short URL not found' 
      });
    }

    // Check if expired
    if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
      return res.status(410).json({ 
        success: false, 
        message: 'This short URL has expired' 
      });
    }

    // Increment click count
    urlEntry.clickCount += 1;
    await urlEntry.save();

    // Redirect to original URL
    res.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during redirect' 
    });
  }
});

// GET /api/urls/my - Get user's URLs
router.get('/api/urls/my', authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    const urlsWithFullPath = urls.map(url => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt
    }));

    res.json({
      success: true,
      count: urls.length,
      data: urlsWithFullPath
    });
  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching URLs' 
    });
  }
});

// GET /api/urls/stats/:shortCode - Get URL statistics
router.get('/api/urls/stats/:shortCode', optionalAuth, async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Short URL not found' 
      });
    }

    // If URL belongs to a user, check if requester is the owner
    if (urlEntry.userId && (!req.userId || urlEntry.userId.toString() !== req.userId.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: {
        originalUrl: urlEntry.originalUrl,
        shortCode: urlEntry.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${urlEntry.shortCode}`,
        clickCount: urlEntry.clickCount,
        createdAt: urlEntry.createdAt,
        expiresAt: urlEntry.expiresAt
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching statistics' 
    });
  }
});

// DELETE /api/urls/:id - Delete URL
router.delete('/api/urls/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const urlEntry = await Url.findOne({ _id: id, userId: req.userId });

    if (!urlEntry) {
      return res.status(404).json({ 
        success: false, 
        message: 'URL not found or access denied' 
      });
    }

    await Url.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Short URL deleted successfully'
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting URL' 
    });
  }
});

module.exports = router;