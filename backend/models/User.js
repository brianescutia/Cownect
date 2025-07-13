// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,        // NEW: Always store emails in lowercase
        trim: true,             // NEW: Remove spaces from beginning/end
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6            // NEW: Minimum password length
    },
    createdAt: {               // NEW: Track when user signed up
        type: Date,
        default: Date.now
    }
});

// 🔥 MAGIC HAPPENS HERE - This runs BEFORE saving to database
// Think of this like a security guard at a bank who processes deposits
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    // This prevents re-hashing already hashed passwords
    if (!this.isModified('password')) return next();

    try {
        // 🧂 Salt rounds = 12 (the "strength" of our stamping machine)
        // Higher number = more secure but slower
        // 12 is the sweet spot for 2024
        const hashedPassword = await bcrypt.hash(this.password, 12);

        // Replace the plain text password with the hashed version
        // It's like replacing the sticky note with a secret code
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// 🔍 This is our password checker function
// Think of it like showing your ID to a bouncer
userSchema.methods.comparePassword = async function (candidatePassword) {
    // bcrypt.compare is like the bouncer checking your ID against their list
    // It takes the plain text password and compares it to the hashed version
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);