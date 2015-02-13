/*
 * Cities controller uses city model
 */
var city = require('../models/city');
var template = "courses/";

exports.autocomplete = function(req, res){
    var param = req.query;
    
    city.getCities(param, function(data){
        var obj = {};
        
        if(data.length){            
            for(var i=0; i<data.length;i++){
                obj[data[i].name+", "+data[i].stateAbbr] = data[i].name+", "+data[i].stateAbbr;
            }
            res.send(obj);
        }
    });
}

exports.list = function(req, res){
    city.list(function(data){
        res.send(data);
    });
}



exports.show = function(req, res){
    var stateId = req.query.stateId;
    city.show(stateId, function(data){
        res.send(data);
    });
}

exports.add = function(req, res){
    var param = req.body;
    city.add(param, function(data){
        res.send(data);
    });
}

exports.edit = function(req, res){
    var param = req.body;
    city.edit(param, function(data){
        res.send(data);
    });
}

exports.remove = function(req, res){
    var id = req.query.id;
    city.del(id, function(data){
        res.send(data);
    });
}