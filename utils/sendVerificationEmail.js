const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, token) {
    try {
        const data = await resend.emails.send({
            from: 'trailtracker@thekenpoist.net',
            to: email,
            subject: 'Verify your email for Trail Tracker',
            html:`
                <p>Thanks for signing up for Trail Tracker. Please verify your email by clicking the link below:</p>
                <p><a href="http://localhost:3000/auth/verify-email?token=${token}">Verify Email</a></p>
                <p>If you didn’t sign up, you can ignore this email.</p>`
        });
    }catch (error) {
        throw error;
    }
}

module.exports = { sendVerificationEmail };


// for future deployment, replace localhost with this:
// <p><a href="https://goaltracker.thekenpoist.net/verify-email?token=${token}">Verify Email</a></p>
