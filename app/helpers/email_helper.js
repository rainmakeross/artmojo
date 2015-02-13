var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   host: "smtpout.secureserver.net",
   port: "465",
   secureConnection: true,
   auth: {
       user: "contact@artmojo.co",
       pass: "123456"
   }
});

exports.send = function(to, from, callback){
    smtpTransport.sendMail({
                from: "Artmojo Admin <admin@artmojo.co>", // sender address
                to: param.first_name+" "+param.last_name+" <"+param.email+">", // comma separated list of receivers
                subject: "Confirmation email from Artmojo", // Subject line
                text: "Hi "+param.first_name+", copy paste the link to the address bar of your browser to activate your Artmojo account. Link: " + config.routeUrl + "users/verifytoken/?token="+token // plaintext body
             }, function(error, response){
                if(error){
                    console.log(error);
                    callback("Email sending failed. Use this link to activate, link:" + config.routeUrl + "users/verifytoken/?token="+token);
                }else{
                    console.log("Message sent: " + response.message);
                    callback("You are registered. Please check your email to activate your account.");
                }
             });
}