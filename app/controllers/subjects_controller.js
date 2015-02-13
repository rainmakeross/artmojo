var subject = require('../models/subject');
var template = "subjects/";

exports.list = function(req, res){
    subject.list(function(data){
        res.send(data);
    });
}

exports.all = function(req, res){      
    if(req.user){
        res.render(template + '/all', { 
            title: 'ArtMojo -- Subjects. ',
            meta_keyword: "Artmojo, Search, Artists, Subjects, Schools",
            meta_description: "Latest Art Jobs including concerts, free classes, art bashes and parties.",         
            loggedUser: 1
       });
    }else{
        res.redirect('/login');
    }     
		
}

exports.listall = function(req, res){
    subject.listall(function(data){
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
        title: 'Post Subject', 
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
            subject.fetchDatabyId(jobId, function(data){
                res.render(template + '/edit', { 
                            title: 'Edit Subject', 
                            loggedUser: loggedUser, 
                            userId: userId,
                            subject: data
                        });
            });
        }
        
    }
}

exports.doadd = function(req, res){
    var param = req.body;
    subject.checkSubjectByTitle(param, 0, function(data){
        //console.log(data);
        if(data){            
            
            subject.add(param, function(data){
                console.log(data);
                res.redirect('/allsubjects');
            }); 
        }else{
            req.session.subjectsavemsg = "Name has to be unique.";
            res.redirect('/subjects/public/add');
        }
    })
          
    
    //res.send(param);
    
		
}

exports.doedit = function(req, res){
    var param = req.body;
    
    var subjectId = param.subjectId;
    subject.checkSubjectByTitle(param, subjectId, function(data){
        if(data){
            
            
            subject.edit(param, function(data){
                    console.log(data);
                    res.redirect('/allsubjects');
                            
                });
        }else{
            req.session.subjectsavemsg = "Name has to be unique.";
            res.redirect('/subjects/public/edit?id='+subjectId);
        }
    })
          
    
    //res.send(param);
    
		
}


exports.remove = function(req, res){
    var id = req.query.id;
    subject.del(id, function(data){
        res.send(data);
    });
}