const nodemailer = require('nodemailer');
const cors = require('cors');

const corsMiddleware = cors({
  origin: 'https://www.swiftcores.com',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
});


module.exports = async (req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method === 'OPTIONS') {
      // Respond to preflight requests
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { fullName, companyName, email, message , budget} = req.body;

    if (!fullName || !companyName || !email || !budget || !message) {
      return res.status(400).send('All fields are required.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_APP_KEY, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'alika.shako@gmail.com',
      subject: 'New Order',
      text: `
        New Order Details:

        Full Name: ${fullName}
        Company Name: ${companyName}
        Email: ${email}
        Budget: ${budget}
        Message: ${message}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      res.status(200).send('Email sent successfully!');
    } catch (error) {
      console.error('Error occurred:', error.message);
      res.status(500).send('Error occurred while sending email.');
    }
  });
};
