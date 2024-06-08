const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const data = req.body;
    
    // Send an email with the data
    sendEmail(data, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.json({ success: 'Email sent', info: info });
    });
});

function sendEmail(data, callback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });
    
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'your-email@gmail.com',
        subject: 'New Questionnaire Submission',
        text: `Name: ${data.name}\nEmail: ${data.email}\nAnswers:\n${data.answers.map((a, i) => `${i + 1}. ${a.question}: ${a.answer}`).join('\n')}`
    };
    
    transporter.sendMail(mailOptions, callback);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
