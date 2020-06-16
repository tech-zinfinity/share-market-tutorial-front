const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// const cors = require('cors')({origin: true});
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     return cors(request, response, () => {
//         response.send({data:{message: "Hello from Firebase!"}});
//     })
 
// });

//const functions = require("firebase-functions");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require("cors")({
  origin: true
});

exports.emailMessage = functions.https.onRequest((req, res) => {
  const { name, email, phone, message } = req.body;
  return cors(req, res, () => {
    var text = `<div>
      <h4>Information</h4>
      <ul>
        <li>
          Name - ${name || ""}
        </li>
        <li>
          Email - ${email || ""}
        </li>
        <li>
          Phone - ${phone || ""}
        </li>
      </ul>
      <h4>Message</h4>
      <p>${message || ""}</p>
    </div>`;
     var sesAccessKey = 'redkar.darshan11@gmail.com';
     var sesSecretKey = 'Shamika@18351112';

     var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
          user: sesAccessKey,
          pass: sesSecretKey
      }
    }));
    const mailOptions = {
      to: email,
      from: "redkar.darshan11@gmail.com",
      subject: `${name} sent you a new message`,
      text: text,
      html: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
     if(error){
        console.log(error.message);
     }
     res.status(200).send({data:{
       message: "success"
     }});
    });
  }).catch(() => {
    res.status(500).send({data:{
        err:'error'
    }});
  });
});
