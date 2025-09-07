// =============================================================================
// MENTOR MATCHER SERVICE - FIXED WITH PROPER MATCHING
// Save as: backend/services/MentorMatcher.js
// =============================================================================

class MentorMatcher {
    constructor() {
        // Updated mentor database with multiple career interests
        this.mentors = [
            {
                id: 'vikram-choudhry',
                name: 'Vikram Choudhry',
                year: 'Senior',
                major: 'Computer Science',
                careerInterests: ['Solutions Architect', 'Solutions Engineering', 'Software Engineering', 'Consulting'],
                hobbies: ['Hooping', 'Golfing', 'Gaming', 'Reading'],
                companies: ['NVIDIA', 'Lavu', 'Stanford Health Care'],
                profilePicture: '../assets/mentors/vikram-choudhry.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'daniel-kim',
                name: 'Daniel Kim',
                year: 'Junior',
                major: 'Computer Science & Statistics',
                careerInterests: ['Software Engineering', 'Data Science'],
                hobbies: ['Hiking', 'Reading', 'Event Planning', 'Videography', 'Concerts'],
                companies: ['LinkedIn'],
                profilePicture: '../assets/mentors/daniel-kim.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'shrey-gupta',
                name: 'Shrey Gupta',
                year: 'Junior',
                major: 'Computer Science',
                careerInterests: ['Entrepreneurship', 'Product Management', 'Startups'],
                hobbies: ['Hacking', 'Backpacking'],
                companies: ['Y Combinator', 'Capital One', 'NASA', 'Notion'],
                profilePicture: '../assets/mentors/shrey-gupta.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'anirudh-murugesan',
                name: 'Anirudh Murugesan',
                year: 'Senior',
                major: 'Cognitive Science & Statistics',
                careerInterests: ['Product Management', 'Startups', 'Building Teams', 'Strategy'],
                hobbies: ['Basketball', 'Golf', 'Nonprofits', 'Mentorship', 'Travel', 'Food'],
                companies: ['Visa'],
                profilePicture: '../assets/mentors/anirudh-murugesan.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'latisha-luu',
                name: 'Latisha Luu',
                year: 'Junior',
                major: 'Quantitative Psychology',
                careerInterests: ['Product Marketing', 'Growth Marketing'],
                hobbies: ['Snowboarding', 'Coffee', 'Collecting trinkets'],
                companies: ['Amazon'],
                profilePicture: '../assets/mentors/latisha-luu.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'mohnish-gopi',
                name: 'Mohnish Gopi',
                year: 'Junior',
                major: 'Computer Science',
                careerInterests: ['Software Engineering', 'Product Management', 'Research', 'Startups'],
                hobbies: ['Long drives', 'Gym', 'Badminton', 'Photography', 'Movies'],
                companies: ['Microsoft'],
                profilePicture: '../assets/mentors/mohnish-gopi.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'sreeya-yakkala',
                name: 'Sreeya Yakkala',
                year: 'Junior',
                major: 'Computer Science',
                careerInterests: ['Product Management', 'Software Engineering'],
                hobbies: ['Hiking', 'Reading', 'Crocheting', 'Lacrosse'],
                companies: ['Microsoft', 'Mercedes-Benz R&D'],
                profilePicture: '../assets/mentors/sreeya-yakkala.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'curtis-chen',
                name: 'Curtis Chen',
                year: 'Junior',
                major: 'Computer Science & Psychology',
                careerInterests: ['Product Management'],
                hobbies: ['Watching shows and films', 'Legos', 'Strategy games', 'Sports'],
                companies: ['Amazon'],
                profilePicture: '../assets/mentors/curtis-chen.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'hanson-nguyen',
                name: 'Hanson Nguyen',
                year: 'Senior',
                major: 'Computer Engineering',
                careerInterests: ['Software Engineering'],
                hobbies: ['Coding', 'Pickleball', 'Gym', 'Cooking'],
                companies: ['Dolby Laboratories', 'Capital One'],
                profilePicture: '../assets/mentors/hanson-nguyen.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'aine-keenan',
                name: 'Aine Keenan',
                year: 'Junior',
                major: 'Computer Science',
                careerInterests: ['Software Engineering', 'Developer Advocate'],
                hobbies: ['NYC', 'Backend product', 'Public speaking'],
                companies: ['Chevron', 'Red Hat'],
                profilePicture: '../assets/mentors/aine-keenan.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'yahli-hazan',
                name: 'Yahli Hazan',
                year: 'Senior',
                major: 'Computer Science & Cognitive Science',
                careerInterests: ['Founder', 'Software Engineering', 'Builder'],
                hobbies: ['Reading', 'Snowboarding', 'Guitar', 'Writing', 'Building'],
                companies: ['Robust Intelligence'],
                profilePicture: '../assets/mentors/yahli-hazan.jpg', // Add this line to each mentor

                expressoUrl: 'https://www.expressodavis.org/dashboard'
            },
            {
                id: 'dorothy-balkon',
                name: 'Dorothy Balkon',
                year: 'Senior',
                major: 'Cognitive Science',
                careerInterests: ['UX Design'],
                hobbies: ['Gaming', 'Music', 'Eating', 'Working out'],
                companies: ['Verizon'],
                profilePicture: '../assets/mentors/dorothy-balkon.jpg', // Add this line to each mentor
                expressoUrl: 'https://www.expressodavis.org/dashboard'
            }
        ];
    }

    async findMatches(userInputs, userProfile) {
        console.log('🎯 Finding mentor matches based on user inputs:', userInputs);

        // Calculate match scores for each mentor
        const scoredMentors = this.mentors.map(mentor => {
            const score = this.calculateMatchScore(userInputs, mentor);
            return {
                ...mentor,
                matchScore: score
            };
        });

        // Sort by match score and return top 3
        scoredMentors.sort((a, b) => b.matchScore - a.matchScore);
        const topMatches = scoredMentors.slice(0, 3);

        console.log('✅ Top matches:', topMatches.map(m => `${m.name} (${m.matchScore}%)`));

        return topMatches;
    }

    calculateMatchScore(userInputs, mentor) {
        let score = 0;
        let maxScore = 0;
        let matchedFactors = [];

        // 1. Major Match (20 points)
        maxScore += 20;
        if (userInputs.major && userInputs.major.length > 0) {
            for (const userMajor of userInputs.major) {
                if (mentor.major.toLowerCase().includes(userMajor.toLowerCase()) ||
                    userMajor.toLowerCase().includes(mentor.major.toLowerCase())) {
                    score += 20;
                    matchedFactors.push(`Major: ${userMajor}`);
                    break;
                }
            }
        }

        // 2. Career Interests Match (35 points - most important)
        maxScore += 35;
        if (userInputs.career && userInputs.career.length > 0) {
            let careerMatchPoints = 0;
            for (const userCareer of userInputs.career) {
                for (const mentorCareer of mentor.careerInterests) {
                    if (mentorCareer.toLowerCase().includes(userCareer.toLowerCase()) ||
                        userCareer.toLowerCase().includes(mentorCareer.toLowerCase())) {
                        careerMatchPoints += 15; // Points for each matching career interest
                        matchedFactors.push(`Career: ${userCareer}`);
                    }
                }
            }
            score += Math.min(35, careerMatchPoints); // Cap at max points
        }

        // 3. Hobbies Match (20 points)
        maxScore += 20;
        if (userInputs.hobbies && userInputs.hobbies.length > 0) {
            let hobbyMatchPoints = 0;
            for (const userHobby of userInputs.hobbies) {
                for (const mentorHobby of mentor.hobbies) {
                    if (mentorHobby.toLowerCase().includes(userHobby.toLowerCase()) ||
                        userHobby.toLowerCase().includes(mentorHobby.toLowerCase())) {
                        hobbyMatchPoints += 10;
                        matchedFactors.push(`Hobby: ${userHobby}`);
                    }
                }
            }
            score += Math.min(20, hobbyMatchPoints);
        }

        // 4. Mentorship Type Match (15 points)
        maxScore += 15;
        if (userInputs.mentorship && userInputs.mentorship.length > 0) {
            for (const need of userInputs.mentorship) {
                const needLower = need.toLowerCase();

                // Map mentorship needs to mentor strengths
                if (needLower.includes('career') && mentor.careerInterests.length > 2) {
                    score += 15;
                    matchedFactors.push('Career guidance');
                    break;
                }
                if (needLower.includes('interview') && mentor.companies.length > 1) {
                    score += 15;
                    matchedFactors.push('Interview experience');
                    break;
                }
                if (needLower.includes('technical') &&
                    mentor.careerInterests.some(c => c.toLowerCase().includes('engineer'))) {
                    score += 15;
                    matchedFactors.push('Technical skills');
                    break;
                }
                if (needLower.includes('product') &&
                    mentor.careerInterests.some(c => c.toLowerCase().includes('product'))) {
                    score += 15;
                    matchedFactors.push('Product expertise');
                    break;
                }
            }
        }

        // 5. Industry Match (10 points)
        maxScore += 10;
        if (userInputs.industry && userInputs.industry.length > 0) {
            for (const industry of userInputs.industry) {
                const industryLower = industry.toLowerCase();

                // Check company experience
                if (industryLower.includes('tech') || industryLower.includes('faang')) {
                    if (mentor.companies.some(c =>
                        ['Microsoft', 'Amazon', 'LinkedIn', 'Tesla', 'NVIDIA'].includes(c))) {
                        score += 10;
                        matchedFactors.push('Big Tech experience');
                        break;
                    }
                }
                if (industryLower.includes('startup')) {
                    if (mentor.careerInterests.some(c =>
                        c.toLowerCase().includes('startup') || c.toLowerCase().includes('founder'))) {
                        score += 10;
                        matchedFactors.push('Startup experience');
                        break;
                    }
                }
            }
        }

        // Calculate percentage
        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

        console.log(`Mentor: ${mentor.name}, Score: ${score}/${maxScore} = ${percentage}%, Matched: ${matchedFactors.join(', ')}`);

        return percentage;
    }
}

module.exports = MentorMatcher;