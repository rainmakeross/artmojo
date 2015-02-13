var schema = require('../../schema');
var Artist = schema.Artist;
var ArtistCredential = schema.ArtistCredential;
var db = schema.sequelize;

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

exports.getcredentials = function(callback){
   var sql = "SELECT * FROM credentials ";
   console.log(sql);
   db.query(sql)
   .error(function(err){
       console.log(err);
       callback(false);
   })
   .success(function(data) {
    callback(data);
  });
}



exports.findByArtist = function(artistId, credentialId, callback){
   var sql = "SELECT * FROM artist_credentials WHERE artistId = '"+artistId+"' ";
   if(credentialId){
       sql += " AND credentialId = '"+credentialId+"' ";
   }
   console.log(sql);
   db.query(sql)
   .error(function(err){
       console.log(err);
       callback(false);
   })
   .success(function(data) {
    callback(data);
  });
}



exports.findById = function(id, callback){
    ArtistCredential.find({ where: {id: id}}).success(function(data){ 
        callback(data);
      }); 
}



// CRUD CODE





exports.publicadd = function(param, callback){
    var sql = "insert into artist_credentials set ";
        sql     += " artistId='"+param.artistId+"', ";
        sql     += " credentialId='"+param.categoryId+"', ";
        sql     += " title='"+param.title+"', ";
        sql     += " role='"+param.role+"', ";
        sql     += " production='"+param.production+"', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
        console.log(sql);
        db.query(sql)
        .error(function(err){
            console.log(err);
        })
        .success(function() {
            callback("success");	
        });
    
}

exports.publicedit = function(param, callback){
    
    var sql = "update artist_credentials ";
    sql     += " artistId='"+param.artistId+"', ";
    sql     += " credentialId='"+param.credentialId+"', ";
    sql     += " title='"+param.title+"', ";
    sql     += " role='"+param.role+"', ";
    sql     += " production='"+param.production+"', ";
    sql     += " updatedAt=NOW() where id = '"+param.id+"' ";
    console.log(sql);
    db.query(sql)
    .error(function(err){
        console.log(err);
    })
    .success(function() {
        callback("success");	
    });
    
}





exports.del = function(id, callback){
    ArtistCredential.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Artist deleted"+info);
        });
    });
}