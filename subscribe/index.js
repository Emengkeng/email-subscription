const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../db/query/subscribe');
const Queue = require('bull');


const REDIS_URL = process.env.INTERNAL_REDIS_URL || 'redis://127.0.0.1:6379';
// Create a Bull queue
const emailQueue = new Queue('email-queue', REDIS_URL);


function validUser(user){
	const validEmail = typeof user.email == 'string' &&
						user.email.trim() != "" &&
						user.email.trim().length >=6;
	return validEmail;
}

// Configure your email transporter
const transporter = nodemailer.createTransport({
	host: 'smtp.titan.email',
	secureConnection: false,
	tls: {
		ciphers: "SSLv3",
	},
	requireTLS: true,
	port: 465,
	secure: true,
	auth: {
		user: process.env.SMTP_EMAIL,
		pass: process.env.SMTP_PASSWORD,
	}
});

// List of admin email addresses
const adminEmails = ['info@exhert.com', 'blessedsonlove@gmail.com'];

router.post('/signup',(req,res) => {

	if(validUser(req.body)){
		User
		.getOneByEmail(req.body.email)
		.then(user => {
			if(!user){
				const user = {
					email : req.body.email
				};
				User
					.create(user)
					.then (id =>{
						res.json({
							id,
							message: "Signedup for mailing list"
						});
					})
			} else {
				res.json({
					message: "This email is in use"
				});
			}
		});
	} else {
		res.json({
			message: "This email is not valid"
		});
	}
	
});


router.post('/contact', async (req, res) => {
	const { name, email, message } = req.body;

	// Add job to the queue
	await emailQueue.add({
		name,
		email,
		message
	});
	
	res.status(200).send('Your message has been queued for processing');
});

// Process jobs from the queue
emailQueue.process(async (job) => {
	const { name, email, message } = job.data;

	const mailOptions = {
		from: 'noreply@exhert.com',
		to: adminEmails.join(', '),
		subject: 'New Contact Form Submission',
		text: `
			Name: ${name}
			Email: ${email}
			Message: ${message}
		`
	};
	try {
		await transporter.sendMail(mailOptions);
		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending email:', error);
	  	throw error; // This will cause the job to be retried
	}
});

//module.exports makes this router availabe across the app.
module.exports = router;