// backend/routes/careerDataRoutes.js
// New route file to serve static career data

const express = require('express');
const router = express.Router();
const { completeCareerRequirements } = require('../data/completeCareerRequirements');

// GET /api/career-data/:careerName
router.get('/career-data/:careerName', (req, res) => {
    try {
        const careerName = decodeURIComponent(req.params.careerName);
        console.log(`📚 Fetching static data for career: ${careerName}`);

        const careerData = completeCareerRequirements[careerName];

        if (!careerData) {
            console.warn(`Career data not found for: ${careerName}`);
            return res.status(404).json({
                error: 'Career data not found',
                career: careerName
            });
        }

        // Return the static career data
        res.json({
            career: careerName,
            ...careerData
        });

    } catch (error) {
        console.error('Error fetching career data:', error);
        res.status(500).json({
            error: 'Failed to fetch career data'
        });
    }
});

// GET /api/career-data - List all available careers
router.get('/career-data', (req, res) => {
    try {
        const careers = Object.keys(completeCareerRequirements);
        res.json({
            totalCareers: careers.length,
            careers: careers
        });
    } catch (error) {
        console.error('Error listing careers:', error);
        res.status(500).json({
            error: 'Failed to list careers'
        });
    }
});

module.exports = router;