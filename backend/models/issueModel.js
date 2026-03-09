const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    s3ImageUrl: {
        type: String,
        required: true
    },
    s3ResolvedImageUrl: {
        type: String,
        default: null
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    upvotes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved'],
        default: 'Open'
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    humanLossOrEffect: {
        type: String,
        default: ''
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    transactionId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

issueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', issueSchema);
