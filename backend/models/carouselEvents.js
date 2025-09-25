const mongoose = require('mongoose');

const carouselEventSchema = new mongoose.Schema({
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    registrationUrl: {
        type: String,
        default: '#'
    },
    capacity: {
        type: Number,
        default: null
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    imageUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for better query performance
carouselEventSchema.index({ clubId: 1, date: -1 });

const CarouselEvent = mongoose.model('CarouselEvent', carouselEventSchema);

module.exports = CarouselEvent;