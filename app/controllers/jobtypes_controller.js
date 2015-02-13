var jobtype = require('../models/jobtype');
var template = "jobtype/";

exports.list = function(req, res){
    jobtype.list(function(data){
        res.send(data);
    });
}

exports.add = function(req, res){
    var param = req.body;
    jobtype.add(param, function(data){
        res.send(data);
    });
}

exports.edit = function(req, res){
    var param = req.body;
    jobtype.edit(param, function(data){
        res.send(data);
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    jobtype.del(id, function(data){
        res.send(data);
    });
}