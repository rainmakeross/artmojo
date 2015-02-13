
/*
 * Artists controller uses artist model
 */
//var artist = require('../models/artist');
var template = "pages/";
var nodemailer = require("nodemailer");
var city = require('../models/city');
/*var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "mithun.raincheck@gmail.com",
       pass: "FulGrain123$"
   }
});*/

var smtpTransport = nodemailer.createTransport("SMTP",{
   host: "smtpout.secureserver.net",
   port: "465",
   secureConnection: true,
   auth: {
       user: "contact@artmojo.co",
       pass: "123456"
   }
});


exports.terms = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/terms', { 
        title: 'Terms and Conditions', 
        meta_keyword: 'Artmojo, Terms and Conditions',
        meta_description: 'Artmojo, Terms and Conditions.',
        loggedUser: loggedUser 
    });
}
exports.faq = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/faq', { title: 'FAQ', 
        meta_keyword: 'Artmojo, FAQ',
        meta_description: 'Artmojo, FAQ.', loggedUser: loggedUser });
}
exports.about = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/about', { 
        title: 'ArtMojo -- About Us', 
        meta_keyword: 'Art Mojo, ArtMojo, About Us, Biography, Biographies, Advisor, Employee',
        meta_description: 'Executive, employee and advisor biographies.',
        loggedUser: loggedUser });
}
exports.privacy = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/privacy', { title: 'Privacy', 
        meta_keyword: 'Artmojo, Privacy',
        meta_description: 'Artmojo, Privacys.', loggedUser: loggedUser });
}
exports.contact = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/contact', { 
        title: 'ArtMojo -- Contact Us.', 
        meta_keyword: 'Art Mojo, ArtMojo, Contact Us, Email, Form',
        meta_description: 'Contact ArtMojo Team', loggedUser: loggedUser });
}

exports.doContact = function(req, res){
    var param = req.body;
    smtpTransport.sendMail({
        from: param.full_name+" <"+param.semail+">",
        to: "Admin <info@artmojo.co>", // comma separated list of receivers
        subject: "Contact email from Artmojo", // Subject line
        text: "Hi Admin, Sub: "+param.subject+". Message: " + param.subject
     }, function(error, response){
        if(error){
            console.log(error);
            res.send("Email sending failed.");
        }else{
            console.log("Message sent: " + response.message);
            res.send("Thank you for contacting us. We will get back to you ASAP.");
        }
     });
}

exports.legal = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/legal', { title: 'Legal', 
        meta_keyword: 'Artmojo, Legal',
        meta_description: 'Artmojo, Legal.', loggedUser: loggedUser });
}

var gepApi = require('geoip-lite');

exports.geoip = function(req, res){
    var ip = req.ip;
    var geoIp = gepApi.lookup(ip);
    if(geoIp){        
        city.fetchDatabyGeoip(geoIp.city, function(cityData){
            if(cityData){
                geoIp.city = cityData.name;
                geoIp.region = cityData.stateAbbr;
            }
            res.send(geoIp);
        });    
    }else{
        res.send(geoIp);
    }
    
    
}
/*
exports.geoip = function(req, res){
    var ip = req.ip;
    var geoIp = gepApi.lookup(ip);
    console.log(geoIp);
    res.send(geoIp);   
    
}*/