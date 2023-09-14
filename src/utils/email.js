const nodemailer= require('nodemailer');

const sendEmail=async (option)=>{
    //Create a transpoter
    const transpoter= nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    //Defing Email Options
    const emailOptions= {
        from:process.env.USER_EMAIL,
        to:option.email,
        subject: option.subject,
        text: option.message
    }
  await  transpoter.sendMail(emailOptions)
}
module.exports = sendEmail;