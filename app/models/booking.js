var schema = require('../../schema');
var Booking = schema.Booking;
var db = schema.sequelize;

exports.listall = function(callback){
    var Sql = "select * from bookings order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.listmybookings = function(userId, callback){
    var Sql = "select * from bookings where userId = '"+userId+"' order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.listrequests = function(artistId, callback){
    var Sql = "select * from bookings where artistId = '"+artistId+"' order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.listconfirmeds = function(artistId, callback){
    var Sql = "select * from bookings where artistId = '"+artistId+"' and confirmed = '1' order by createdAt desc";
    db.query(Sql).success(function(data) {
      callback(data);
    });
} 

exports.fetchDatabyId = function(id, callback){
    Booking.find({ where: {id: id}}).success(function(booking){ 
        callback(booking);
      }); 
}

exports.add = function(param, callback){
    var requestDate = param.booking_year + '-' + param.booking_month + '-' + param.booking_date;
    var requestTime = param.booking_time1 + ':' + param.booking_time2 + ':' + param.booking_time3;
    var returnVal = 1;
    var sql = "insert into bookings ";
        sql     += " set userId='"+param.userId+"', ";
        sql     += " artistId='"+param.artistId+"', ";
        sql     += " courseId='"+param.course+"', ";
        sql     += " userName='"+param.userName+"', ";
        sql     += " artistName='"+param.artistName+"', ";
        sql     += " requestDate='"+requestDate+"', ";
        sql     += " requestTime='"+requestTime+"', ";
        sql     += " requestSpan='"+param.booking_time4+"', ";
        sql     += " amount='0.00', ";
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

exports.accept = function(param, callback){
    console.log(param);
    var returnVal = 1;
    var sql = "update bookings ";
        sql     += " set amount='"+param.amount+"', ";
        sql     += " status='1', ";
        sql     += " updatedAt=NOW() ";
        sql     += " where id = '"+param.id+"' ";
    
    db.query(sql)
    .error(function(err){
        console.log(err);
        returnVal = 0;
        callback(returnVal);
    })
    .success(function(){
        
        callback(returnVal); 
    });
    
    
};
exports.confirm = function(id, callback){
    //console.log(param);
    var returnVal = 1;
    var sql = "update bookings ";
        sql     += " set confirmed='1', ";
        sql     += " updatedAt=NOW() ";
        sql     += " where id = '"+id+"' ";
    
    db.query(sql)
    .error(function(err){
        console.log(err);
        returnVal = 0;
        callback(returnVal);
    })
    .success(function(){
        
        callback(returnVal); 
    });
    
    
};



exports.del = function(id, callback){
    Booking.find({where: {id: id}}).success(function(remove){
        remove.destroy().on('success', function(info){
            callback("Booking deleted"+info);
        });
    });
}

