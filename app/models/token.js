var schema = require('../../schema');
var Token = schema.Token;
var User = schema.User;



exports.consume = function(token, callback){
    Token.find({ where: {token: token}}).success(function(token){ 
        if(token){
            User.find({ where: {id: token.userId}}).success(function(user){ 
                callback(user);
              });
        }
      }); 
}
 

exports.add = function(token, userId, callback){
    var add = Token.build({
        token: token,
        userId: userId
    });
    add.save()
    .error(function(err){
        callback(err);
    })
    .success(function(){
        callback("Done");
    });
}

