var schema = require('../../schema');
var User = schema.User;
var artistModel = require('./artist.js');
var balanceModel = require('./userbalance.js');
var db = schema.sequelize;

exports.listall = function(callback){
    var Sql = "select * from users order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    User.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}

exports.tempsignup = function(param, callback){
    var returnVal = 1;
    var sql = "insert into temp_users ";
        sql     += " set first_name='"+param.first_name+"', ";
        sql     += " last_name='"+param.last_name+"', ";
        sql     += " email='"+param.semail+"', ";
        sql     += " password='"+param.spassword+"', ";
        sql     += " artistId='"+param.artistId+"', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err);
        callback(returnVal);
    })
    .success(function(){
        returnVal = 0;
        callback(returnVal); 
    });
    
    
};


exports.signup = function(param, callback){
    var returnVal = 1;
    var sql = "insert into users ";
        sql     += " set first_name='"+param.first_name+"', ";
        sql     += " last_name='"+param.last_name+"', ";
        sql     += " full_name='"+param.first_name+" "+param.last_name+"', ";
        sql     += " email='"+param.semail+"', ";
        sql     += " password='"+param.spassword+"', ";
        sql     += " verify_token='"+param.verify_token+"', ";
        sql     += " user_typeId='2', ";
        sql     += " email_verified='0', ";
        sql     += " status='0', ";
        sql     += " is_newsletter='0', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err);
        callback(returnVal);
    })
    .success(function(){
        returnVal = 0;
        var artistId = param.artistId;
        if(artistId == 0){
            artistModel.registerArtist(param, function(data){
                
             });
        }else{
            artistModel.updateArtist(param, function(data){
                
             });
        }
        balanceModel.registerUserBalance(param, function(data){
                
             });
        callback(returnVal); 
    });
    
    
};

exports.checkLogin = function(param, callback){
    var email = param.email;
    var pass = param.password;
    User.find({ where: {email: email, password: pass}}).success(function(user){ 
        callback(user);
      }); 
}

exports.checkEmail = function(email, callback){
    User.find({ where: {email: email }}).success(function(user){ 
        callback(user);
      }); 
}


exports.verifyToken = function(token, callback){
    var bool = false;
    //console.log(token);
    var sql = "select * from users where verify_token = '"+token+"'";
    db.query(sql)
    .success(function(user){
        //console.log(user);
        if(user.length){
            //perform update
            var updateSql = "UPDATE users SET verify_token = null, email_verified = 1, status = 1 WHERE id = '"+user[0].id+"' ";
            db.query(updateSql)
            .success(function(){
                bool = true;
                callback(bool);
            })
            .error(function(err){
                console.log(err);
                callback(bool);
            });
            
        }else{
            callback(bool);
        }
    })
    .error(function(err){
        console.log(err);
        callback(bool);
    });
    
}

exports.fetchDatabyId = function(id, callback){
    User.find({ where: {id: id}}).success(function(user){ 
        callback(user);
      }); 
}

exports.getDatabyId = function(id, callback){
    
    User.find({ where: {id: id}}).success(function(user){ 
        callback(user);
      }); 
}

// CRUD CODE

exports.list = function(callback){
    User.findAll().success(function(data) {
         callback(data);
    }); 
} 

exports.add = function(param, callback){
    var returnVal = 1;
    var sql = "insert into users ";
        sql     += " set first_name='"+param.first_name+"', ";
        sql     += " last_name='"+param.last_name+"', ";
        sql     += " full_name='"+param.first_name+" "+param.last_name+"', ";
        sql     += " email='"+param.email+"', ";
        sql     += " password='"+param.password+"', ";
        sql     += " verify_token=null, ";
        sql     += " user_typeId='"+param.user_typeId+"', ";
        sql     += " email_verified='1', ";
        sql     += " status='1', ";
        sql     += " is_newsletter='1', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        console.log(err);
        callback(returnVal);
    })
    .success(function(){
        returnVal = 0;
        if(param.user_typeId == 2){
             artistModel.registerArtist(param, function(data){
                
             });
        }
        
        
        callback(returnVal); 
    });
    
    
};

exports.edit = function(param, callback){
    var returnVal = 0;
    var sql = "update users ";
    sql     += " set first_name='"+param.first_name+"', ";
    sql     += " last_name='"+param.last_name+"', ";
    sql     += " full_name='"+param.first_name+" "+param.last_name+"', ";
    sql     += " email='"+param.email+"', ";
    sql     += " password='"+param.password+"', ";
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.id+"' ";
    db.query(sql)
    .error(function(err){
        console.log(err);
        returnVal = 1;
        callback(returnVal);
    })
    .success(function() {
            console.log(sql);
	callback(returnVal);
    });
}

exports.del = function(id, callback){
    User.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("User deleted"+info);
        });
    });
}

exports.checkToken = function(token, callback){
    User.find({ where: {access_token: token}}).success(function(user){ 
        callback(user);
      });
}

exports.addToken = function(token, id, callback){
    User.find({where : {id: id}}).success(function(edit){
        edit.access_token = token;
        edit.save()
        .error(function(err){
            callback(0);
        })
        .success(function(){
            callback(1);
        });
    });
}

exports.doedit = function(param, callback){
    var returnVal = 0;
    var sql = "update users ";
    sql     += " set first_name='"+param.first_name+"', ";
    sql     += " last_name='"+param.last_name+"', ";
    sql     += " full_name='"+param.first_name+" "+param.last_name+"', ";
    sql     += " email='"+param.email+"', ";
    sql     += " password='"+param.password+"', ";
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+param.id+"' ";
    db.query(sql)
    .error(function(err){
        returnVal = 1;
        callback(returnVal);
    })
    .success(function() {
	callback(returnVal);
    });
}

exports.reFormToken = function(token, id, callback){
    var returnVal = 0;
    var sql = "update users ";
    sql     += " set verify_token='"+token+"', ";
    sql     += " updatedAt=NOW() ";
    sql     += " where id = '"+id+"' ";
    db.query(sql)
    .error(function(err){
        returnVal = 1;
        callback(returnVal);
    })
    .success(function() {
	callback(returnVal);
    });
}
