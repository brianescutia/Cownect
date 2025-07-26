// 🔒 Require authentication
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// ✅ Require email verification
const requireVerification = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/login');
        }

        const User = require('../models/User');
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect('/login');
        }

        if (!user.isVerified) {
            return res.redirect('/verify-email-prompt');
        }

        next();
    } catch (error) {
        console.error('Verification check error:', error);
        res.redirect('/login');
    }
};

module.exports = {
    requireAuth,
    requireVerification
};