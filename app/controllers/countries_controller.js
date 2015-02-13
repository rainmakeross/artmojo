var country = require('../models/country');
var template = "countries/";

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Countrys. ',
            meta_keyword: "Artmojo, Search, Artists, Courses, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.publicadd = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    if(req.user){
        loggedUser = 1;
        userId = req.user.id;
    }
    
    res.render(template + '/add', { 
        title: 'Post Country', 
        loggedUser: loggedUser, 
        userId: userId  
    });
    
}

exports.publicedit = function(req, res){
    var loggedUser = 0;
    var userId = 0;
    
    if(req.query){
        if(req.query.id.length){
            var jobId = req.query.id; 
            loggedUser = 1;
            userId = req.user.id; 
            country.fetchDatabyId(jobId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit Country', 
                            loggedUser: loggedUser, 
                            userId: userId,
                            country: data
                        });
            });
        }
        
    }
}

exports.listall = function(req, res){
    country.listall(function(data){
        res.send(data);
    });
}

exports.list = function(req, res){
    country.list(function(data){
        res.send(data);
    });
}

exports.doadd = function(req, res){
    var param = req.body;
    country.add(param, function(data){
        res.redirect("/allcountries");
    });
}

exports.doedit = function(req, res){
    var param = req.body;
    country.edit(param, function(data){
        res.redirect("/allcountries");
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    country.del(id, function(data){
        res.send(data);
    });
}