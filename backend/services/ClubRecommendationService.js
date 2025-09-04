// =============================================================================
// FIXED CLUB RECOMMENDATION SERVICE
// Fixed ObjectId errors and simplified for immediate deployment
// =============================================================================

const Club = require('../models/Club');
const mongoose = require('mongoose');



class ClubRecommendationService {
    constructor() {
        // Career to club name mappings (simplified)
        this.directMappings = {
            'Software Engineering': ['#include', '/code lab', 'Google Developer Student Club'],
            'Data Science': ['AI Student Collective', 'Data Science Club', 'Statistics Club'],
            'AI/ML Engineering': ['AI Student Collective', 'Machine Learning Club', 'Computer Vision Club'],
            'DevOps Engineering': ['#include', 'Cloud Computing Club', 'SysAdmin Club'],
            'UX/UI Design': ['Design Club', 'HCI Club', 'Creative Tech Club'],
            'Product Management': ['Product Club', 'Business Tech Club', 'Startup Club'],
            'Cybersecurity': ['Cybersecurity Club', 'Ethical Hacking Club', 'InfoSec Club'],
            'Web Development': ['#include', '/code lab', 'Frontend Club'],
            'Mobile Development': ['Mobile Dev Club', '#include', 'App Development Club'],
            'Game Development': ['Game Development Club', 'Graphics Club', 'Unity Club']
        };

        // Tag-based mappings as fallback
        this.careerTags = {
            'Software Engineering': ['programming', 'coding', 'software', 'development'],
            'Data Science': ['data', 'analytics', 'machine-learning', 'ai'],
            'DevOps Engineering': ['devops', 'infrastructure', 'cloud', 'automation'],
            'UX/UI Design': ['design', 'ux', 'ui', 'user-experience'],
            'Cybersecurity': ['security', 'cybersecurity', 'hacking'],
            'Product Management': ['product', 'business', 'strategy']
        };
    }

    /**
     * Get top 3 club recommendations for a career
     * Fixed to handle ObjectId properly and provide fallbacks
     */
    async getClubRecommendations(careerName, allMatches = []) {
        try {
            console.log(`🏛️ Finding club recommendations for: ${careerName}`);

            let recommendedClubs = [];

            // Strategy 1: Direct name matching
            const directClubs = await this.getClubsByDirectMapping(careerName);
            recommendedClubs = [...recommendedClubs, ...directClubs];

            // Strategy 2: Tag-based matching if we need more
            if (recommendedClubs.length < 3) {
                const tagClubs = await this.getClubsByTags(careerName);
                recommendedClubs = [...recommendedClubs, ...tagClubs];
            }

            // Strategy 3: Popular tech clubs as fallback
            if (recommendedClubs.length < 3) {
                const fallbackClubs = await this.getFallbackClubs();
                recommendedClubs = [...recommendedClubs, ...fallbackClubs];
            }

            // Remove duplicates
            const uniqueClubs = this.removeDuplicateClubs(recommendedClubs);

            // Return top 3 with enhanced data
            return uniqueClubs.slice(0, 3).map(club => this.enhanceClubForResponse(club, careerName));

        } catch (error) {
            console.error('Error getting club recommendations:', error);
            return this.getHardcodedFallbacks();
        }
    }

    /**
     * Get clubs by direct name mapping
     */
    async getClubsByDirectMapping(careerName) {
        const clubNames = this.directMappings[careerName] || [];

        if (clubNames.length === 0) return [];

        try {
            const clubs = await Club.find({
                name: { $in: clubNames },
                isActive: true
            }).limit(3).lean();

            console.log(`Found ${clubs.length} clubs by direct mapping`);
            return clubs;
        } catch (error) {
            console.error('Error in direct mapping search:', error);
            return [];
        }
    }

    /**
     * Get clubs by tag matching
     */
    async getClubsByTags(careerName) {
        const tags = this.careerTags[careerName] || [];

        if (tags.length === 0) return [];

        try {
            const clubs = await Club.find({
                tags: { $in: tags },
                isActive: true
            }).limit(5).lean();

            console.log(`Found ${clubs.length} clubs by tag matching`);
            return clubs;
        } catch (error) {
            console.error('Error in tag-based search:', error);
            return [];
        }
    }

    /**
     * Get popular fallback clubs
     */
    async getFallbackClubs() {
        try {
            const clubs = await Club.find({
                isActive: true,
                $or: [
                    { name: { $in: ['#include', 'AI Student Collective', 'AggieWorks'] } },
                    { tags: { $in: ['programming', 'technology', 'coding'] } }
                ]
            }).limit(3).lean();

            console.log(`Found ${clubs.length} fallback clubs`);
            return clubs;
        } catch (error) {
            console.error('Error getting fallback clubs:', error);
            return [];
        }
    }

    /**
     * Remove duplicate clubs based on _id
     */
    removeDuplicateClubs(clubs) {
        const seen = new Map();
        return clubs.filter(club => {
            const id = club._id.toString();
            if (seen.has(id)) {
                return false;
            }
            seen.set(id, true);
            return true;
        });
    }

    /**
     * Enhance club data for response
     */
    enhanceClubForResponse(club, careerName) {
        // Ensure we have a valid ObjectId
        const clubId = club._id ? club._id.toString() : new mongoose.Types.ObjectId().toString();

        return {
            _id: clubId,
            name: club.name || 'Tech Club',
            description: club.description || `Great club for developing skills relevant to ${careerName}`,
            logoUrl: club.logoUrl || '/assets/default-club-logo.png',
            tags: club.tags || ['technology'],
            memberCount: club.memberCount || 0,
            isActive: club.isActive !== false,

            // Enhanced fields for recommendations
            relevanceScore: this.calculateRelevanceScore(club, careerName),
            careerRelevance: this.getCareerRelevanceText(club, careerName),
            recommendationReason: this.getRecommendationReason(club, careerName),
            suggestedActions: this.getSuggestedActions(club, careerName)
        };
    }

    /**
     * Calculate relevance score
     */
    calculateRelevanceScore(club, careerName) {
        let score = 70; // Base score

        // Boost for direct name mapping
        if (this.directMappings[careerName]?.includes(club.name)) {
            score += 25;
        }

        // Boost for tag matching
        const careerTags = this.careerTags[careerName] || [];
        const clubTags = club.tags || [];
        const matchingTags = clubTags.filter(tag => careerTags.includes(tag));
        score += matchingTags.length * 5;

        // Boost for member count
        if (club.memberCount > 50) score += 5;

        return Math.min(score, 100);
    }

    /**
     * Get career relevance text
     */
    getCareerRelevanceText(club, careerName) {
        const relevanceMap = {
            'Software Engineering': 'Perfect for building coding skills and software projects',
            'Data Science': 'Ideal for hands-on data analysis and machine learning projects',
            'UX/UI Design': 'Excellent for developing design thinking and user research skills',
            'DevOps Engineering': 'Great for learning infrastructure and deployment practices',
            'Cybersecurity': 'Perfect for ethical hacking and security research'
        };

        return relevanceMap[careerName] || 'Great for building relevant technical skills';
    }

    /**
     * Get recommendation reason
     */
    getRecommendationReason(club, careerName) {
        const reasons = [
            `Highly relevant to ${careerName} skills`,
            'Active community with regular events',
            'Hands-on projects and workshops',
            'Industry connections and networking'
        ];

        // Choose based on club characteristics
        if (club.memberCount > 100) return reasons[1];
        if (club.tags?.includes('projects')) return reasons[2];
        if (club.tags?.includes('networking')) return reasons[3];
        return reasons[0];
    }

    /**
     * Get suggested actions
     */
    getSuggestedActions(club, careerName) {
        return [
            'Attend their next meeting or workshop',
            'Connect with club officers',
            'Join their online community',
            'Participate in upcoming projects'
        ];
    }

    /**
     * Hardcoded fallbacks when database fails
     */
    getHardcodedFallbacks() {
        console.log('🚨 Using hardcoded club fallbacks');

        return [
            {
                _id: new mongoose.Types.ObjectId().toString(),
                name: '#include',
                description: 'Build real-world coding projects with fellow students and develop practical programming skills.',
                logoUrl: '/assets/include.png',
                tags: ['programming', 'coding'],
                memberCount: 150,
                isActive: true,
                relevanceScore: 90,
                careerRelevance: 'Perfect for building foundational programming skills',
                recommendationReason: 'Most popular programming club at UC Davis',
                suggestedActions: [
                    'Attend their weekly coding sessions',
                    'Join their Discord community',
                    'Participate in their hackathons',
                    'Work on collaborative projects'
                ]
            },
            {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'AI Student Collective',
                description: 'Explore machine learning, AI research, and cutting-edge technology with like-minded students.',
                logoUrl: '/assets/aiStudentCollective.png',
                tags: ['ai', 'machine-learning', 'research'],
                memberCount: 120,
                isActive: true,
                relevanceScore: 88,
                careerRelevance: 'Ideal for exploring AI and data science careers',
                recommendationReason: 'Leading AI/ML community on campus',
                suggestedActions: [
                    'Join their research projects',
                    'Attend AI/ML workshops',
                    'Network with graduate students',
                    'Present your own projects'
                ]
            },
            {
                _id: new mongoose.Types.ObjectId().toString(),
                name: 'AggieWorks',
                description: 'Hands-on makerspace for electronics, hardware projects, and innovative engineering solutions.',
                logoUrl: '/assets/aggieworks.png',
                tags: ['hardware', 'electronics', 'making'],
                memberCount: 80,
                isActive: true,
                relevanceScore: 85,
                careerRelevance: 'Excellent for hands-on technical experience',
                recommendationReason: 'Best hardware and maker community at UC Davis',
                suggestedActions: [
                    'Use their makerspace facilities',
                    'Join hardware project teams',
                    'Learn 3D printing and PCB design',
                    'Collaborate on innovative projects'
                ]
            }
        ];
    }
}

module.exports = ClubRecommendationService;