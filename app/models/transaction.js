var schema = require('../../schema');
var Transaction = schema.Transaction;
var db = schema.sequelize;

exports.listall = function(callback){
    var Sql = "select * from transactions order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.listpaidBytransactions = function(userId, callback){
    var Sql = "select * from transactions where paidBy = '"+userId+"' order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.listpaidTotransactions = function(id, callback){
    var Sql = "select * from transactions where paidTo = '"+id+"' order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    Transaction.find({ where: {id: id}}).success(function(transaction){ 
        callback(transaction);
      }); 
}

exports.add = function(param, callback){
    var returnVal = 1;
    var sql = "insert into transactions ";
        sql     += " set paidBy='"+param.paidBy+"', ";
        sql     += " bookingId='"+param.bookingId+"', ";
        sql     += " paidTo='"+param.paidTo+"', ";
        sql     += " paymentReason='"+param.paymentReason+"', ";
        sql     += " transactionId='"+param.transactionId+"', ";
        sql     += " amount='"+param.amount+"', ";
        sql     += " createdAt=NOW(), ";
        sql     += " updatedAt=NOW() ";
    db.query(sql)
    .error(function(err){
        returnVal = 0;
        callback(returnVal);
    })
    .success(function(){
        
        callback(returnVal); 
    });
    
    
};




exports.del = function(id, callback){
    Transaction.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Transaction deleted"+info);
        });
    });
}

