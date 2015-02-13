var subscriber = require('../models/subscriber');
var template = "subscriber/";

exports.subscribe = function(req, res){
    var param = req.body;
    subscriber.add(param, function(data){
        res.send(data);
    });
}

exports.list = function(req, res){
    subscriber.list(function(data){
        res.send(data);
    });
}

exports.add = function(req, res){
    var param = req.body;
    subscriber.add(param, function(data){
        res.send(data);
    });
}

exports.edit = function(req, res){
    var param = req.body;
    subscriber.edit(param, function(data){
        res.send(data);
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    subscriber.del(id, function(data){
        res.send(data);
    });
}
