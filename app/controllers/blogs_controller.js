
/*
 * Artists controller uses blog model
 */
var blog = require('../models/blog');
var template = "blogs/";
var config = require('../../config/config');
var utils = require('../helpers/utils');
var fs = require('fs');

exports.index = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
    }
    res.render(template + '/index', { title: 'Artmojo Blog', loggedUser: loggedUser, userId: userId });
}


exports.publicadd = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
        res.render(template + '/publicadd', { title: 'Start A Blog', loggedUser: loggedUser, userId: userId });
    }else{
        res.redirect("/blogs");
    }
    
}

exports.publicedit = function(req, res){
    var url = req.query.url;
    var loggedIn = 0;
    var loggedUser = 0;
    if(req.user){
        loggedIn = 1;
        loggedUser = 1;
    }
    blog.showDetails(url, function(data){
        if(data){
            var desc = data.full_name+" specializes in "+data.course_tag
            if(data.description){
                desc = data.description;
            }
            var keyword = "Artmojo";
            if(data.title){
                keyword += ","+data.title;
            }
            

            res.render(template + '/publicedit', { 
                title: data.title,
                meta_keyword: keyword,
                meta_description: "My Blog", 
                blog: data,
                logStatus : loggedIn,
                loggedUser: loggedUser
            });
        }else{
            res.redirect("/");
        }
    });
}


exports.view = function(req, res){
    var url = req.query.url;
    var loggedIn = 0;
    var loggedUser = 0;
    if(req.user){
        loggedIn = 1;
        loggedUser = 1;
    }
    blog.showDetails(url, function(data){
        if(data){
            
            var totalRate = (data.total_rate * 4);
            var date = new Date(data.createdAt);
            var postDate = date.getDate();
            var postMonth = (date.getMonth()+1);
            var postYear = date.getFullYear(); 
            var fullDate = postYear+'/'+postMonth+'/'+postDate;
            
            res.render(template + '/view', { 
                title: data.title+" @ "+data.first_name+" "+data.last_name,
                meta_keyword: 'Artmojo, blog',
                meta_description: 'Artmojo blog', 
                blog: data,
                totalRate: totalRate,
                logStatus : loggedIn,
                loggedUser: loggedUser,
                postDate: fullDate
            });
        }else{
            res.redirect("/");
        }
    });
}



exports.showreviews = function(req, res){
    var id = req.query.id;
    blog.showReview(id, function(data){
        res.send(data);
    });
}

exports.addreview = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    blog.addReview(userId, param, function(data){
        res.send(data);
    });
}



exports.rateBlog = function(req, res){
    var param = req.body;
    if(req.user){
        var userId = req.user.id;
        
        blog.addRating(param, userId, function(data){
            if(data == 0){
                var obj = { "message": "You have already voted", "avgRate": 0 };
                res.send(obj); 
            }else{
                var obj = { "message": "Vote successfully saved", "avgRate": data };
                res.send(obj); 
            }
        });        
    }else{
        var obj = { "message": "Please login to vote" };
        res.send(obj);
    }
}

exports.loadBlogs = function(req, res){
       
    blog.loadAll(function(data){
        res.send(data) ;
    });
}

exports.loadSample = function(req, res){
       
    blog.loadSample(function(data){
        res.send(data) ;
    });
}


exports.doadd = function(req, res){
    var param = req.body;
    var userId = req.user.id;
    
    blog.publicadd(param, userId, function(data){
        if(data){
           res.redirect('/blogs'); 
        }
    });
}


exports.doedit = function(req, res){
    var param = req.body;
    
    blog.publicedit(param, function(data){
        if(data){
           res.redirect('/blogs'); 
        }
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    blog.del(id, function(data){
        res.send(data);
    });
}
