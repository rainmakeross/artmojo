var state = require('../models/state');
var template = "states/";

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- States. ',
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
        title: 'Post State', 
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
            state.fetchDatabyId(jobId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit State', 
                            loggedUser: loggedUser, 
                            userId: userId,
                            state: data
                        });
            });
        }
        
    }
}

exports.listall = function(req, res){
    state.listall(function(data){
        res.send(data);
    });
}
exports.list = function(req, res){
    state.list(function(data){
        res.send(data);
    });
}

exports.show = function(req, res){
    var countryId = req.query.countryId;
    state.show(countryId, function(data){
        res.send(data);
    });
}

exports.doadd = function(req, res){
    var param = req.body;
    console.log(param);
    state.add(param, function(data){
        console.log(data);
        res.redirect("/allstates");
    });
}

exports.doedit = function(req, res){
    var param = req.body;
    state.edit(param, function(data){
        console.log(data);
        res.redirect("/allstates");
    });
}
exports.remove = function(req, res){
    var id = req.query.id;
    state.del(id, function(data){
        res.send(data);
    });
}