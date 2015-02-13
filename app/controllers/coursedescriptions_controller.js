var coursedescription = require('../models/coursedescription');
var template = "coursedescription/";

exports.list = function(req, res){
    coursedescription.list(function(data){
        res.send(data);
    });
}

exports.add = function(req, res){
    var param = req.body;
    coursedescription.add(param, function(data){
        res.send(data);
    });
}

exports.edit = function(req, res){
    var param = req.body;
    coursedescription.edit(param, function(data){
        res.send(data);
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    coursedescription.del(id, function(data){
        res.send(data);
    });
}