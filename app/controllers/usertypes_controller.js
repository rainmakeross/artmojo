var usertype = require('../models/usertype');
var template = "usertype/";

exports.list = function(req, res){
    usertype.list(function(data){
        res.send(data);
    });
}

exports.add = function(req, res){
    var param = req.body;
    usertype.add(param, function(data){
        res.send(data);
    });
}

exports.edit = function(req, res){
    var param = req.body;
    usertype.edit(param, function(data){
        res.send(data);
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    usertype.del(id, function(data){
        res.send(data);
    });
}