// backend/models/UserSkillProfile.js
const userSkillSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currentSkills: [{
        skill: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] }
    }],
    learningGoals: [{
        skill: String,
        targetDate: Date,
        progress: Number
    }],
    completedCourses: [String],
    certifications: [String]
});