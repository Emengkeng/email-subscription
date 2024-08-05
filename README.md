# Email Subscription Backend Component
Email Subscription Api accepts user email address and saves the data into mysql database. 
Incase if user is already enrolled then Api responds with "Email already in use" message.
Some basic backend validations are also in place and can be extended.

Sample Api to refer in postman:
localhost:5000/subscribe/signup

Sample request body:

```JSON
{"email" : "ravitejakolla@email.com"}
```

localhost:5000/subscribe/contact
```JSON
{
    "email": "test@gmail.com",
    "name": "name",
    "message": "message"
}
```

Technology Stack:
NodeJs(20.13.1), ExpressJs, KnexJs, Mysql, Redis

