
/*
 * GET users listing.
 */
var user       = require('../models/user')
  , artist     = require('../models/artist')
  , city       = require('../models/city')
  , school     = require('../models/school')
  , utils      = require('../helpers/utils')
  , config     = require('../../config/config')
  , fs         = require('fs')
  , errorLog   = config.webroot + '/logs/'
  , template = "users/"
  , email_template = "emailtpl/"
  , artistTemplate = "artists/";

//set up admin email

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Users. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.listall = function(req, res){
    user.listall(function(data){
        res.send(data);
    });
}

exports.publicadd = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
    }
    
    res.render(template + '/add', { 
        title: 'Post User', 
        loggedUser: loggedUser, 
        userId: userId  
    });
    
}

exports.publicedit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    
    if(req.query){
        if(req.query.id.length){
            var userId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id; 
            user.fetchDatabyId(userId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit User', 
                            loggedUser: loggedUser, 
                            userId: userId,
                            user: data
                        });
            });
        }
        
    }
}

exports.doaddlist = function(req, res){
    var param = req.body;
    user.add(param, function(data){
        res.redirect("/allusers");
    });
}

exports.doeditlist = function(req, res){
    var param = req.body;
    user.edit(param, function(data){
        console.log(data);
        res.redirect("/allusers");
    });
}




exports.login = function(req, res){
    var alert = false;
    var message = '';
    if(req.query.vm == 1){
        alert = true;
        message = 'Account activated. Please login';
    }
    if(req.query.vm == 0){
        alert = true;
        message = 'Invalid token. Please retry';
    }
    if(req.query.lm == 0){
        alert = true;
        message = 'Wrong Username or Password.';
    }
    res.render(template + '/login', { 
            title: 'ArtMojo -- Sign in',
            meta_keyword: 'Login, Sign In',
            meta_description: 'Login to ArtMojo',
            alert: alert,
            message: message
        }); 
};

exports.signup = function(req, res){
    var alert = false;
    var artistId = 0;
    var artistEmail = "";
    var message = '';
    
    if(req.query.url){
        var url = req.query.url;
        artist.fetchDatabyUrl(url, function(data){
            if(data){                    
                res.render(template + '/signup', { 
                    title: 'ArtMojo -- Sign up',
                    meta_keyword: 'Login, Sign In, Sign Up, Register',
                    meta_description: 'Sing Up and Login in to ArtMojo',
                    artistId: data.id,
                    artistEmail: data.email,
                    url: url,
                    alert: alert,
                    message: message
                });
            }else{
                alert = true;
                message = 'Referred artist does not exists.';
                res.render(template + '/signup', { 
                    title: 'ArtMojo -- Sign up',
                    meta_keyword: 'Sign Up, Register',
                    meta_description: 'Sing Up and Login in to ArtMojo',
                    artistId: artistId,
                    artistEmail: artistEmail,
                    url: url,
                    alert: alert,
                    message: message
                });
            }
        });
    }else{
       res.render(template + '/signup', { 
            title: 'ArtMojo -- Sign up',
            meta_keyword: 'Sign Up, Register',
            meta_description: 'Sing Up and Login in to ArtMojo',
            artistId: artistId,
            artistEmail: artistEmail,
            url: "",
            alert: alert,
            message: message
        }); 
    }    
};

exports.resendVerify = function(req, res){
    if(req.user){ 
        if(req.user.email_verified == 0){
            res.render(template + '/resendVerify', { 
                            title: 'Resend email validation link',
                            meta_keyword: 'Artmojo, Email',
                            meta_description: 'Artmojo Resend email validation page',
                            loggedUser: "1",
                            user: req.user
                        });
        }else{
            res.redirect('/profile');
        }
        
    }else{
        res.redirect('/login');
    }
}

exports.resendToken = function(req, res){
    var token = "Abcd123Sdrf";
    utils.randomString(64, function(rdStr){
        token = rdStr;
    });
    var userId = req.user.id;
    console.log(token);
    
    user.reFormToken(token, userId, function(data){
        var link = config.routeUrl + "users/verifytoken/?token="+token;
        var name = req.user.first_name+" "+req.user.last_name;
        res.mailer.send(email_template + 'confirmationemail-etpl', {
            to: req.user.email,
            subject: 'Validation email from Artmojo',
            name: name,
            link: link,
            image: config.routeUrl + "images/logo.png"
          }, function (err) {
            if (err) {
                // handle error
                //console.log(err);
                var errorText = JSON.stringify(err)+'\r\n';
                fs.appendFile(errorLog+'/error-email.log', errorText, function (fileerr) {
                    if(fileerr){
                        console.log(fileerr);
                    }
                });
                res.send('There was an error rendering the email');
                


            }else{
                //console.log(message);
                res.send("Validation email resend to your mailbox. Please check your email to activate your account.");
            }

          });
    }); 
};





exports.profile = function(req, res){
    //console.log(req.user);
    
    //console.log(req.session.artistId);
    if(req.user){   
        if(req.user.email_verified == 0){
            res.redirect('/users/verify');
        }else{
            var userId = req.user.id;
            //check whether artist is associated with user
            //console.log(userId);
            artist.fetchDatabyUser(userId, function(data){
                console.log(data);
                if(data){
                    var pasteUrl = data.artist_image;
                    if(data.localImg == 1){
                        pasteUrl = "";
                    }
                    req.session.artistId = data.id;
                    res.render(artistTemplate + '/myprofile', { 
                        title: 'My profile',
                        meta_keyword: 'Artmojo, Profile',
                        meta_description: 'Artmojo Profile page',
                        loggedUser: "1",
                        artist: data,
                        pasteUrl: pasteUrl
                    });
                }else{
                    if(req.user.user_typeId == 3){
                        res.render(template + '/opprofile', { 
                                    title: 'Edit profile',
                                    meta_keyword: 'Artmojo, Profile',
                                    meta_description: 'Artmojo Profile page',
                                    loggedUser: "1",
                                    user: req.user,
                                    artistId: "0"
                                });    
                    }else{
                        if(req.user.user_typeId == 1){
                            res.render(template + '/myprofile', { 
                                title: 'Edit profile',
                                meta_keyword: 'Artmojo, Profile',
                                meta_description: 'Artmojo Profile page',
                                loggedUser: "1",
                                user: req.user,
                                artistId: "0"
                            });
                        }
                        
                    }
                    


                }
            }); 
        }           
    }else{
       res.redirect('/login'); 
    }
    
    
};

exports.editprofile = function(req, res){
    //console.log(req.user);
    if(req.user){   
        var userId = req.user.id;
        //check whether artist is associated with user
        artist.fetchDatabyUser(userId, function(data){
            if(data){
                var pasteUrl = data.artist_image;
                if(data.localImg == 1){
                    pasteUrl = "";
                }
                var cityId = data.cityId;
                city.getState(cityId, function(state){
                    if(state){
                       res.render(template + '/editprofile', { 
                            title: 'My profile',
                            meta_keyword: 'Artmojo, Profile',
                            meta_description: 'Artmojo Profile page',
                            loggedUser: "1",
                            artist: data,
                            pasteUrl: pasteUrl,
                            country: state.countryId,
                            state: state.id
                        }); 
                    }
                });
            }else{
                res.render(template + '/edituserprofile', { 
                            title: 'Edit profile',
                            meta_keyword: 'Artmojo, Profile',
                            meta_description: 'Artmojo Profile page',
                            loggedUser: "1",
                            user: req.user,
                            artistId: "0"
                        });
            }
        });   
    }else{
       res.redirect('/login'); 
    }
    
    
};

exports.editlogininfo = function(req, res){
    //console.log(req.user);
    
    
    if(req.user){   
        //check whether artist is associated with user
        res.render(template + '/edituserprofile', { 
                            title: 'Edit profile',
                            meta_keyword: 'Artmojo, Profile',
                            meta_description: 'Artmojo Profile page',
                            loggedUser: "1",
                            user: req.user,
                            artistId: "0"
        });   
    }else{
       res.redirect('/login'); 
    }
    
    
};

// AJAX Response / Post data
exports.dosignup = function(req, res){
    //console.log(req.user);
    
    var param = req.body;
    var token = "Abcd123Sdrf";
    utils.randomString(64, function(rdStr){
        token = rdStr;
    });
    //console.log(token);
    //console.log(req.body);
    param['verify_token'] = token;
    var artistEmail = param.artistEmail;
    var userEmail = param.seEmail;
    var normalReg = true;
    if(artistEmail){
        if(artistEmail == userEmail){
            //normal registration
            normalReg = true;
        }else{
            //register as temp
            normalReg = false;
        }
    }else{
        normalReg = true;        
    }
    if(normalReg){
       user.signup(param, function(data){
            if(data == 1){
                res.send("Email already registered");
            }else{
                var link = config.routeUrl + "users/verifytoken/?token="+token;
                var name = param.first_name+" "+param.last_name;
                var textToSend = "<p>Artmojo is a unique space built just for art seekers like you to find mentors, pick up a new hobby, collaborate or play in. Our goal is to turn Art mainstream... Everybody is an artist. We are here to help you find what you are looking for.</p>";
                textToSend += "<p style='padding-top: 12px;'>For the final step of your registration, please click the below.</p>";
                textToSend += "<br /><a href='"+link+"'>Click to confirm your registration @artmojo</a>";
                res.mailer.send(email_template + 'confirmationemail-etpl', {
                    to: param.semail,
                    subject: 'Confirmation email from Artmojo',
                    name: name,
                    textToSend: textToSend,
                    image: config.routeUrl + "images/logo.png"
                  }, function (err) {
                    if (err) {
                        // handle error
                        var errorText = JSON.stringify(err)+'\r\n';
                        fs.appendFile(errorLog+'/error-email.log', errorText, function (fileerr) {
                            if(fileerr){
                                console.log(fileerr);
                            }
                        });
                        res.send('There was an error rendering the email');
                    }else{
                        //console.log(message);
                        res.send("Registration completed. Please check your email to activate your account.");
                        //send email to admin as well
                        res.mailer.send(email_template + 'adminalert-etpl', {
                            to: 'info@artmojo.co',
                            subject: 'Hello Admin - A user has joined',
                            textMsg: 'A new user has joined the site.<br />Name: '+name+"<br />Email:"+param.semail+"<br />Password:"+param.password,
                            image: config.routeUrl + "images/logo.png"
                          }, function (err) {
                            if (err) {
                                // handle error
                                var errorText = JSON.stringify(err)+'\r\n';
                                fs.appendFile(errorLog+'/error-email.log', errorText, function (fileerr) {
                                    if(fileerr){
                                        console.log(fileerr);
                                    }
                                });
                            }

                          });
                        
                        
                    }
                    
                  });
            }
        }); 
    }else{
        user.tempsignup(param, function(data){
            if(data == 1){
                res.send("Registration failed");
            }else{
                res.send("Registration completed. \n Our team of experts will verify your account \n and send you an activation email \n within next 2-3 bussiness days.");
            }
        }); 
    }
       
    
};

exports.verifytoken = function(req, res){
    var token = req.query.token;
    console.log(token);
    user.verifyToken(token, function(data){
        console.log(data);
        if(data){
            if(req.user){
                res.redirect("/profile");
            }else{
                res.redirect("/login?vm=1");
            }
        }else{
            if(req.user){
                req.logout();
                res.clearCookie('remember_me');
            }            
            res.redirect("/login?vm=0");
        }
    });
}

exports.doedit = function(req, res){
    //console.log(req.user);
    var param = req.body;
    param['id'] = req.user.id;
    
    user.edit(param, function(data){
        if(data == 1){
            res.redirect("/profile");
        }else{
            res.redirect("/profile");
        }
    });   
    
};




exports.logout = function(req, res){
    req.logout();
    res.clearCookie('remember_me');
    res.redirect('/');
};


exports.resetpassword = function(req, res){
    res.render(template + '/resetpassword', { 
        title: 'Artmojo Forgot Password page',
        meta_keyword: 'Artmojo, Login',
        meta_description: 'Artmojo Login page'
    });
};

exports.sendpassword = function(req, res){
    var email = req.body.semail;
    user.checkEmail(email, function(data){
        if(data){
            res.mailer.send(email_template + 'forgotpassword-etpl', {
                    to: data.email,
                    subject: 'Your forgotten password for Artmojo',
                    name: data.first_name+" "+data.last_name,
                    urpassword: data.password,
                    image: config.routeUrl + "images/logo.png"
                  }, function (err) {
                    if (err) {
                        // handle error
                        var errorText = JSON.stringify(err)+'\r\n';
                        fs.appendFile(errorLog+'/error-email.log', errorText, function (fileerr) {
                            if(fileerr){
                                console.log(fileerr);
                            }
                        });
                        res.send('There was an error rendering the email');
                    }else{
                        //console.log(message);
                        res.send("Your password is sent to your registered email address.");
                    }
                    
                  });
            
           
        }else{
           res.send("Email is not registered with us.");
        }
    });
};

exports.artistlist = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/artistlist', { 
        title: 'Artmojo My List',
        meta_keyword: 'Artmojo, My List',
        meta_description: 'Artmojo My List',
        loggedUser: loggedUser
    });
};

exports.schoollist = function(req, res){
    var loggedUser = 0;
    if(req.user){
        loggedUser = 1;
    }
    res.render(template + '/schoollist', { 
        title: 'Artmojo My List',
        meta_keyword: 'Artmojo, My List',
        meta_description: 'Artmojo My List',
        loggedUser: loggedUser
    });
};

exports.doCheckLogin = function(req,res){
    user.checkLogin({email:'derya.yinanc@gmail.com',password:'1234567'},function(data){
       res.send(data);
    });
}