var category = require('../models/category');
var template = "categories/";

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Categorys. ',
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
        title: 'Post Category', 
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
            category.fetchDatabyId(jobId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit Category', 
                            loggedUser: loggedUser, 
                            userId: userId,
                            category: data
                        });
            });
        }
        
    }
}

exports.listall = function(req, res){
    category.listall(function(data){
        res.send(data);
    });
}

exports.list = function(req, res){
    category.list(function(data){
        res.send(data);
    });
}

exports.doadd = function(req, res){
    var param = req.body;
    category.add(param, function(data){
        res.redirect("/allcategories");
    });
}

exports.doedit = function(req, res){
    var param = req.body;
    category.edit(param, function(data){
        res.redirect("/allcategories");
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    category.del(id, function(data){
        res.send(data);
    });
}