const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../db/query/subscribe');

function validUser(user){
	const validEmail = typeof user.email == 'string' &&
						user.email.trim() != "" &&
						user.email.trim().length >=6;
	return validEmail;
}

// Configure your email transporter
const transporter = nodemailer.createTransport({
	host: 'smtp.titan.email',
	port: 465,
	secure: false,
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


app.post('/contact', async (req, res) => {
	const { name, email, message } = req.body;

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
		res.status(200).send('Message sent successfully');
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).send('Error sending message');
	}
});


//module.exports makes this router availabe across the app.
module.exports = router;