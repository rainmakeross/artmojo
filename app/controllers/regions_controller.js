var region = require('../models/region');
var template = "region/";

exports.list = function(req, res){
    region.list(function(data){
        res.send(data);
    });
}

exports.add = function(req, res){
    var param = req.body;
    region.add(param, function(data){
        res.send(data);
    });
}

exports.edit = function(req, res){
    var param = req.body;
    region.edit(param, function(data){
        res.send(data);
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    region.del(id, function(data){
        res.send(data);
    });
}