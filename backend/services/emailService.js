const axios = require('axios');
const User = require('../models/userModel');

const BREVO_API_KEY = process.env.BREVO_API_KEY ;

const sendNewIssueAlert = async (issue) => {
    try {
        // Fetch users to notify (for now, notify all users, or we could filter by nearby)
        const users = await User.find({ role: 'customer' }).select('email name');

        if (users.length === 0) return;

        const emailData = {
            sender: { name: "Civic Issue Reporter", email: "girishpatil621@gmail.com" },
            to: users.map(user => ({ email: user.email, name: user.name })),
            subject: `New Issue Reported Nearby: ${issue.title}`,
            htmlContent: `
                <html>
                <body>
                    <h2>A new civic issue has been reported in your area!</h2>
                    <p><strong>Title:</strong> ${issue.title}</p>
                    <p><strong>Description:</strong> ${issue.description}</p>
                    ${issue.humanLossOrEffect ? `<p><strong>Impact/Loss Experienced:</strong> ${issue.humanLossOrEffect}</p>` : ''}
                    <p>Please visit the application to view the exact location and upvote the issue to bring it to the admin's attention faster.</p>
                </body>
                </html>
            `
        };

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            }
        });

        console.log(`Sent email alert for issue ${issue._id} to ${users.length} users. Response:`, response.data);
    } catch (error) {
        console.error("Error sending Brevo email:", error.response ? error.response.data : error.message);
    }
};

module.exports = {
    sendNewIssueAlert
};
