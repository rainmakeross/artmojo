var schema = require('../../schema');
var UserBalance = schema.UserBalance;
var userModel = require('./user.js');
var db = schema.sequelize;



exports.fetchDatabyId = function(id, callback){
    UserBalance.find({ where: {id: id}}).success(function(artist){ 
        callback(artist);
      }); 
}

exports.fetchDatabyUser = function(userId, callback){
    UserBalance.find({ where: {userId: userId}}).success(function(artist){ 
        callback(artist);
      }); 
}

exports.registerUserBalance = function(param, callback){
    var email = param.semail;
    userModel.checkEmail(email, function(data){
        var userId = data.id;
        var sql = "insert into user_balances ";
        sql     += " set userId='"+userId+"', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
        console.log(sql);
        db.query(sql).success(function() {
            callback(true);	
        });
    });
    
}

exports.updateUserBalance = function(param, callback){
    var sql = "update user_balances ";
    sql     += " set balance='"+param.balance+"', ";
    sql     += " applicableBalance='"+param.applicableBalance+"', ";
    sql     += " updatedAt=NOW() where userId = '"+param.userId+"' ";
    console.log(sql);
    db.query(sql).success(function() {
        callback("success");	
    });
    
}
