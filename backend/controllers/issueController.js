const Issue = require('../models/issueModel');
const emailService = require('../services/emailService');
const { uploadToS3 } = require('../services/s3Service');

const getNearbyIssues = async (req, res) => {
    const { lat, lng } = req.query;

    try {
        if (!lat || !lng) {
            return res.status(400).json({ message: 'lat and lng query parameters are required' });
        }

        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 5000
                }
            }
        }).populate('reporter', 'name email phone resolvedCount');

        res.status(200).json(issues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createIssue = async (req, res) => {
    const { title, description, lat, lng, humanLossOrEffect, transactionId } = req.body;

    try {
        if (!title || !description || !lat || !lng || !transactionId) {
            return res.status(400).json({ message: 'title, description, lat, lng, and transactionId are required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Upload to S3 and get public URL
        const imageUrl = await uploadToS3(req.file);

        const issue = await Issue.create({
            title,
            description,
            humanLossOrEffect: humanLossOrEffect || '',
            s3ImageUrl: imageUrl,
            reporter: req.user._id,
            transactionId: transactionId,
            paymentStatus: true,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            }
        });

        // Send email alerts in background
        emailService.sendNewIssueAlert(issue).catch(err => console.error("Email service error:", err));

        res.status(201).json({ message: 'Issue reported successfully', issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resolveIssue = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Proof image is required' });
        }

        // Upload resolved proof to S3
        const resolvedImageUrl = await uploadToS3(req.file);

        const issue = await Issue.findByIdAndUpdate(
            id,
            {
                status: 'Resolved',
                s3ResolvedImageUrl: resolvedImageUrl
            },
            { new: true }
        );

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        const User = require('../models/userModel');
        await User.findByIdAndUpdate(issue.reporter, { $inc: { resolvedCount: 1 } });

        res.status(200).json({ message: 'Issue resolved successfully', issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const upvoteIssue = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        const hasUpvoted = issue.upvotedBy.includes(userId);

        let updateQuery = {};
        if (hasUpvoted) {
            updateQuery = { $pull: { upvotedBy: userId }, $inc: { upvotes: -1 } };
        } else {
            updateQuery = { $addToSet: { upvotedBy: userId }, $inc: { upvotes: 1 } };
        }

        const updatedIssue = await Issue.findByIdAndUpdate(id, updateQuery, { new: true });

        res.status(200).json({ message: hasUpvoted ? 'Upvote removed' : 'Upvoted', issue: updatedIssue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllOpenIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ status: 'Open' })
            .populate('reporter', 'name email phone resolvedCount')
            .sort({ createdAt: -1 });

        res.status(200).json(issues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getNearbyIssues, createIssue, resolveIssue, upvoteIssue, getAllOpenIssues };
