
/*
 * GET users listing.
 */
var booking       = require('../models/booking')
var user       = require('../models/user')
  , artist     = require('../models/artist')
  , city       = require('../models/city')
  , school     = require('../models/school')
  , utils      = require('../helpers/utils')
  , config     = require('../../config/config')
  , fs         = require('fs')
  , errorLog   = config.webroot + '/logs/'
  , template = "bookings/"
  , email_template = "emailtpl/"
  , artistTemplate = "artists/";

//set up admin email

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Bookings. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.listall = function(req, res){
    booking.listall(function(data){
        res.send(data);
    });
}

exports.mylist = function(req, res){      
    if(req.user){
        res.render(template + '/mylist', { 
            title: 'ArtMojo -- Bookings. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.loadMyBookings = function(req, res){
    var userId = req.user.id;
    booking.listmybookings(userId, function(data){
        res.send(data);
    });
}

exports.requests = function(req, res){      
    if(req.user){
        res.render(template + '/requests', { 
            title: 'ArtMojo -- Bookings. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.loadRequests = function(req, res){
    var artistId = req.session.artistId;
    booking.listrequests(artistId, function(data){
        res.send(data);
    });
}

exports.confirmed = function(req, res){      
    if(req.user){
        res.render(template + '/confirmed', { 
            title: 'ArtMojo -- Bookings. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.loadConfirmeds = function(req, res){
    var artistId = req.session.artistId;
    booking.listconfirmeds(artistId, function(data){
        res.send(data);
    });
}

exports.publicadd = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    var userName = 0;
    var artistId = 0;
    var artistName = 0;
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
        userName = req.user.first_name;
    }
    if(req.query){
        if(req.query.artistId.length){
            artistId = req.query.artistId;
            artistName = req.query.artistName;
            res.render(template + '/add', { 
                title: 'Post Booking', 
                loggedUser: loggedUser, 
                artistId: artistId,
                artistName: artistName,
                userId: userId,
                userName: userName
            });
        }
    }
    
    
}

exports.publicedit = function(req, res){
    var loggedUser = 0;
    var bookingId = 0;
    
    if(req.query){
        if(req.query.id.length){
            var bookingId = req.query.id; 
            loggedUser = 1;
            bookingId = req.user.id; 
            booking.fetchDatabyId(bookingId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit Booking', 
                            loggedUser: loggedUser, 
                            bookingId: bookingId,
                            booking: data
                        });
            });
        }
        
    }
}

exports.doadd = function(req, res){
    var param = req.body;
    booking.add(param, function(data){
        var requestDate = param.booking_year + '-' + param.booking_month + '-' + param.booking_date;
        var requestTime = param.booking_time1 + '-' + param.booking_time2 + '-' + param.booking_time3;
        var requestSpan = param.booking_time4;
        var link = config.routeUrl+"bookings/requests";
        var textToSend = param.userName + " wants to book a class with you at " + requestDate + " ," + requestTime + " for " + requestSpan + "hrs";
        textToSend += "<br />If you are a registered member of Artmojo please login and click the link below. Or else please register yourself at Artmojo and follow the Welcome message to activate your account. Come back to this email and link on the link below.";
        textToSend += "<br><a href='"+link+"'>Confirm booking</a>";
        var artistId = param.artistId;
        artist.fetchDatabyId(artistId, function(data){
            res.mailer.send(email_template + 'bookingemail-etpl', {
                to: data.email,
                subject: 'You have a booking @ Artmojo.co',
                artistName: param.artistName,
                userName: param.userName,
                requestDate: requestDate,
                requestTime: requestTime,
                requestSpan: requestSpan,
                textToSend: textToSend,
                image: config.routeUrl + "images/logo.png"
              }, function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/mybookings");
                }else{
                    res.redirect("/mybookings");
                }

              });
        })
        
        
    });
}

exports.accept = function(req, res){
    var loggedUser = 0;
    var bookingId = 0;
    var userId = 0;
    
    if(req.query){
        if(req.query.id.length){
            bookingId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id; 
            booking.fetchDatabyId(bookingId, function(data){
                res.render(template + '/accept', { 
                            title: 'Accept Booking', 
                            loggedUser: loggedUser,
                            userId: userId,
                            bookingId: bookingId,
                            booking: data
                        });
            });
        }
        
    }
}

exports.doaccept = function(req, res){
    var param = req.body;
    booking.accept(param, function(data){
        var userId = param.userId;
        var link = config.routeUrl+"mybookings";
        var textToSend = param.artistName + " has confirmed your booking. Please respond by clicking the link below.";
        textToSend += "<br><a href='"+link+"'>Accept confirmation</a>";
        user.fetchDatabyId(userId, function(data){
            res.mailer.send(email_template + 'bookingaccept-etpl', {
                to: data.email,
                subject: 'Booking confirmation email.',
                artistName: param.artistName,
                userName: param.userName,
                link: config.routeUrl+"mybookings",
                image: config.routeUrl + "images/logo.png"
              }, function (err) {
                if (err) {
                    console.log(err);
                }else{
                    res.redirect("/bookings/requests");
                }

              });
        })
        
    });
}

exports.paynow = function(req, res){
    var loggedUser = 0;
    var bookingId = 0;
    var userId = 0;
    
    if(req.query){
        if(req.query.id.length){
            var bookingId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id; 
            booking.fetchDatabyId(bookingId, function(data){
                var date = new Date(data.requestDate);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                var fullDate = tDate+'/'+tMonth+'/'+tYear;
                res.render(template + '/paynow', { 
                            title: 'Paynow', 
                            loggedUser: loggedUser,
                            userId: userId,
                            fullDate: fullDate,
                            booking: data
                        });
            });
        }
        
    }
}